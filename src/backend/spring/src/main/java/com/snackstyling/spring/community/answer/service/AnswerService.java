package com.snackstyling.spring.community.answer.service;

import com.snackstyling.spring.common.domain.Notification;
import com.snackstyling.spring.common.exception.NotAcceptableException;
import com.snackstyling.spring.common.exception.ServerException;
import com.snackstyling.spring.common.service.JwtService;
import com.snackstyling.spring.common.service.NotificationService;
import com.snackstyling.spring.community.answer.domain.Answer;
import com.snackstyling.spring.community.answer.dto.AnswerNumResponse;
import com.snackstyling.spring.community.answer.dto.AnswerRequest;
import com.snackstyling.spring.community.answer.repository.AnswerRepository;
import com.snackstyling.spring.community.question.domain.Question;
import com.snackstyling.spring.community.question.repository.QuestionRepository;
import com.snackstyling.spring.community.question.service.QuestionService;
import com.snackstyling.spring.community.common.dto.CodiDto;
import com.snackstyling.spring.member.domain.Member;
import com.snackstyling.spring.member.repository.MemberRepository;
import com.snackstyling.spring.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class AnswerService {
    private final AnswerRepository answerRepository;
    private final MemberRepository memberRepository;
    private final QuestionRepository questionRepository;
    private final NotificationService notificationService;
    private final MemberService memberService;
    private final QuestionService questionService;
    private final JwtService jwtService;

    public AnswerNumResponse postAnswer(String token, AnswerRequest answerRequest){
        Answer answer= new Answer();
        Member member=memberService.memberSelect(jwtService.getMemberId(token));
        Question question=questionService.questionSelect(answerRequest.getQid());

        answer.setMember(member);
        answer.setQuestion(question);
        answer.setPostDate(LocalDateTime.now());

        Map<String, Object> map=new HashMap<>();
        map.put("top",answerRequest.getCodi().getTop());
        map.put("bottom", answerRequest.getCodi().getBottom());
        map.put("cap", answerRequest.getCodi().getCap());
        map.put("footwear",answerRequest.getCodi().getFootwear());
        map.put("outer",answerRequest.getCodi().getOuter());
        map.put("bag",answerRequest.getCodi().getBag());
        map.put("comments",answerRequest.getComments());
        HttpHeaders headers=new HttpHeaders();
        headers.set("Authorization", token);

        RestTemplate restTemplate=new RestTemplate();
        String url="http://django-server:8000/api/v1/codi/";
        HttpEntity<Map<String, Object>> entity=new HttpEntity<>(map,headers);
        try {
            ResponseEntity<CodiDto> result = restTemplate.postForEntity(url,entity, CodiDto.class);
            answer.setCodi(result.getBody().getId());
        }catch(Exception e){
            throw new ServerException("?????? ????????? ????????? ??????????????????.");
        }
        answerRepository.save(answer);
        Notification notify= new Notification();
        notify.setMember(question.getMember());
        notify.setQuestion(question);
        notify.setAnswer(answer);
        notify.setType(0); //0??? ?????? ????????? ????????? ????????? ??? ??????

        notificationService.saveNotification(notify);
        return new AnswerNumResponse(answer.getId());
    }
    public void deleteAnswer(Long id){
        Answer answer=answerRepository.findById(id).orElse(null);
        Question question=answer.getQuestion();
        if(question.getAdopt()==1){
            throw new NotAcceptableException("????????? ???????????? ????????? ????????? ?????????.");
        }
        answer.setUsed(0);
        answerRepository.save(answer);
    }

    public void adoptAnswer(Long id, String token){
        Answer answer=answerRepository.findById(id).orElse(null);
        answer.setAdopt(1);
        answer.getQuestion().setAdopt(1);

        //???????????? ????????? ?????? ?????????
        HttpHeaders headers=new HttpHeaders();
        headers.set("Authorization", token);

        RestTemplate restTemplate=new RestTemplate();
        String url="http://django-server:8000/api/v1/codi/"+answer.getCodi().toString()+"/dup/";
        Map<String, Object> map=new HashMap<>();
        map.put("userId",answer.getMember().getId());
        map.put("date",answer.getQuestion().getPostDate());
        HttpEntity<Map<String, Object>> entity=new HttpEntity<>(map,headers);
        try {
            restTemplate.postForEntity(url,entity,String.class);
        }catch(Exception e){
            throw new ServerException("?????? ????????? ????????? ??????????????????.");
        }
        answer.getMember().setAdoptCnt(answer.getMember().getAdoptCnt()+1);
        answerRepository.save(answer);
        questionRepository.save(answer.getQuestion());
        memberRepository.save(answer.getMember());
        // ??? ????????? ??????????????? ??? ??????
        Notification notify=new Notification();
        notify.setMember(answer.getMember());
        notify.setQuestion(answer.getQuestion());
        notify.setAnswer(answer);
        notify.setType(1);
        notificationService.saveNotification(notify);
        // ???
    }
}
