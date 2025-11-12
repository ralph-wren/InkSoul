package com.inksoul.repository;

import com.inksoul.entity.DiaryEntry;
import com.inksoul.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 日记条目数据访问接口
 * 
 * @author InkSoul Team
 */
@Repository
public interface DiaryEntryRepository extends JpaRepository<DiaryEntry, Long> {

    /**
     * 根据用户查找日记条目
     */
    Page<DiaryEntry> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    /**
     * 根据用户和分类查找日记条目
     */
    Page<DiaryEntry> findByUserAndCategoryOrderByCreatedAtDesc(User user, String category, Pageable pageable);

    /**
     * 根据用户查找指定时间范围内的日记条目
     */
    @Query("SELECT d FROM DiaryEntry d WHERE d.user = :user AND d.createdAt BETWEEN :startDate AND :endDate ORDER BY d.createdAt DESC")
    List<DiaryEntry> findByUserAndDateRange(@Param("user") User user, 
                                           @Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);

    /**
     * 根据用户和关键词搜索日记条目
     */
    @Query("SELECT d FROM DiaryEntry d WHERE d.user = :user AND (d.content LIKE %:keyword% OR d.category LIKE %:keyword%)")
    List<DiaryEntry> searchByKeyword(@Param("user") User user, @Param("keyword") String keyword);

    /**
     * 根据用户查找包含音频的日记条目
     */
    List<DiaryEntry> findByUserAndAudioFileUrlIsNotNull(User user);

    /**
     * 根据用户和情感查找日记条目
     */
    List<DiaryEntry> findByUserAndSentiment(User user, DiaryEntry.Sentiment sentiment);

    /**
     * 统计用户的日记条目数量
     */
    long countByUser(User user);

    /**
     * 统计用户指定分类的日记条目数量
     */
    long countByUserAndCategory(User user, String category);

    /**
     * 查找用户的所有分类
     */
    @Query("SELECT DISTINCT d.category FROM DiaryEntry d WHERE d.user = :user AND d.category IS NOT NULL ORDER BY d.category")
    List<String> findDistinctCategoriesByUser(@Param("user") User user);

    /**
     * 查找最近的日记条目
     */
    List<DiaryEntry> findTop10ByUserOrderByCreatedAtDesc(User user);

    /**
     * 根据标签查找日记条目
     */
    @Query("SELECT d FROM DiaryEntry d WHERE d.user = :user AND d.tags LIKE %:tag%")
    List<DiaryEntry> findByUserAndTag(@Param("user") User user, @Param("tag") String tag);
}