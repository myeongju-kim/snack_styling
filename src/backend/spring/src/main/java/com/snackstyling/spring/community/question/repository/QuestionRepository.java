package com.snackstyling.spring.community.question.repository;

import com.snackstyling.spring.community.question.domain.Question;
import com.snackstyling.spring.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByMember(Member member);
}
