package com.snackstyling.spring.member.service;

import com.snackstyling.spring.common.exception.ConflictException;
import com.snackstyling.spring.community.answer.domain.Answer;
import com.snackstyling.spring.community.answer.repository.AnswerRepository;
import com.snackstyling.spring.community.common.dto.OccasionDto;
import com.snackstyling.spring.community.question.domain.Question;
import com.snackstyling.spring.community.question.dto.QuestionResponse;
import com.snackstyling.spring.community.question.dto.QuestionsResponse;
import com.snackstyling.spring.community.question.repository.QuestionRepository;
import com.snackstyling.spring.member.domain.Member;
import com.snackstyling.spring.member.domain.Suggestion;
import com.snackstyling.spring.member.dto.MemberRequest;
import com.snackstyling.spring.member.dto.MemberInfResponse;
import com.snackstyling.spring.member.dto.RankResponse;
import com.snackstyling.spring.member.dto.RanksResponse;
import com.snackstyling.spring.member.repository.MemberRepository;
import com.snackstyling.spring.member.repository.SuggestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final SuggestionRepository suggestionRepository;

    public void memberUpdate(Long id,MemberRequest memberRequest){
        Member member=memberRepository.findById(id).orElse(null);
        Integer len=memberRequest.getNickname().length();
        if(!member.getNickname().equals(memberRequest.getNickname())
                && memberRepository.existsByNickname(memberRequest.getNickname())){
            throw new ConflictException("닉네임이 중복되었습니다.");
        }
        if(len<3 || len>8){
            throw new ConflictException("이름은 3글자 이상 8글자 이하만 가능합니다.");
        }
        member.setAge(memberRequest.getAge());
        member.setNickname(memberRequest.getNickname());
        member.setGender(memberRequest.getGender());
        member.setWeight(memberRequest.getWeight());
        member.setHeight(memberRequest.getHeight());
        memberRepository.save(member);
    }

    public Member memberSelect(Long id){
        return memberRepository.findById(id).orElse(null);
    }
    public MemberInfResponse memberMyPage(Long id){
        Member member=memberSelect(id);
        return new MemberInfResponse(member.getNickname(), member.getGender(),member.getAge(),
                member.getWeight(),member.getHeight(),member.getAdoptCnt());
    }
    public QuestionsResponse memberQuestions(Long id){
        Member member=memberSelect(id);
        List<Question> questions=questionRepository.findByMemberAndUsed(member,1);
        List<QuestionResponse> questionResponses=new ArrayList<>();
        for (Question temp: questions){
            QuestionResponse questionResponse=new QuestionResponse();
            questionResponse.setQid(temp.getId());
            questionResponse.setMid(temp.getMember().getId());
            questionResponse.setNickname(temp.getMember().getNickname());
            questionResponse.setWeight(temp.getMember().getWeight());
            questionResponse.setHeight(temp.getMember().getHeight());
            questionResponse.setPostDate(temp.getPostDate());
            questionResponse.setEndDate(temp.getEndDate());
            questionResponse.setTpo(new OccasionDto().getTpo(temp.getTpo()));
            questionResponse.setComments(temp.getComments());
            questionResponse.setAnsCount(answerRepository.countByAnswer(temp, 1));
            questionResponses.add(questionResponse);
        }
        return new QuestionsResponse(questionResponses,0,0);
    }
    public QuestionsResponse memberAnswers(Long id){
        Member member=memberSelect(id);
        List<Answer> answers=answerRepository.findByMemberAndUsed(member, 1);
        List<QuestionResponse> questionResponses=new ArrayList<>();
        List<Long> duplicate=new ArrayList<>();
        for(Answer ans :answers){
            QuestionResponse questionResponse=new QuestionResponse();
            Question temp=ans.getQuestion();
            if(duplicate.contains(temp.getId()))continue;
            duplicate.add(temp.getId());
            questionResponse.setQid(temp.getId());
            questionResponse.setMid(temp.getMember().getId());
            questionResponse.setNickname(temp.getMember().getNickname());
            questionResponse.setWeight(temp.getMember().getWeight());
            questionResponse.setHeight(temp.getMember().getHeight());
            questionResponse.setPostDate(temp.getPostDate());
            questionResponse.setEndDate(temp.getEndDate());
            questionResponse.setTpo(new OccasionDto().getTpo(temp.getTpo()));
            questionResponse.setComments(temp.getComments());
            questionResponse.setAnsCount(answerRepository.countByAnswer(temp, 1));
            questionResponses.add(questionResponse);
        }
        return new QuestionsResponse(questionResponses,0,0);
    }
    public void memberSuggestion(Long id, String contents){
        Suggestion suggestion=new Suggestion();
        suggestion.setMember(memberSelect(id));
        suggestion.setContents(contents);
        suggestionRepository.save(suggestion);
    }
    public RanksResponse memberRank(){
        List<Member> members=memberRepository.findTop10ByOrderByAdoptCntDescNicknameAsc();
        List<RankResponse> rankResponses=new ArrayList<>();
        for(Member member : members){
            rankResponses.add(new RankResponse(member.getNickname(),member.getAdoptCnt()));
        }
        return new RanksResponse(rankResponses);
    }
}
