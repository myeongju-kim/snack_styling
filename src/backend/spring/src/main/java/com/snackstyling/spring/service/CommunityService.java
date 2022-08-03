package com.snackstyling.spring.service;

import com.snackstyling.spring.domain.Question;
import com.snackstyling.spring.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class CommunityService {
    private final QuestionRepository questionRepository;

    public void postQuestion(Question question){ questionRepository.save(question);}
    public Page<Question> loadQuestion(Integer page){
        Pageable pageable = PageRequest.of(page,2, Sort.by("postDate").descending());
        return questionRepository.findAll(pageable);
    }
}
