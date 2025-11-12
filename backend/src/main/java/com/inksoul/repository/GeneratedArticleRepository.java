package com.inksoul.repository;

import com.inksoul.entity.GeneratedArticle;
import com.inksoul.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 生成文章数据访问接口
 * 
 * @author InkSoul Team
 */
@Repository
public interface GeneratedArticleRepository extends JpaRepository<GeneratedArticle, Long> {

    /**
     * 根据用户查找生成的文章
     */
    Page<GeneratedArticle> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    /**
     * 根据用户和分类查找文章
     */
    List<GeneratedArticle> findByUserAndCategory(User user, String category);

    /**
     * 根据用户和文章风格查找文章
     */
    List<GeneratedArticle> findByUserAndStyle(User user, GeneratedArticle.ArticleStyle style);

    /**
     * 查找公开的文章
     */
    Page<GeneratedArticle> findByIsPublicTrueOrderByCreatedAtDesc(Pageable pageable);

    /**
     * 根据用户查找公开的文章
     */
    List<GeneratedArticle> findByUserAndIsPublicTrue(User user);

    /**
     * 根据标题搜索文章
     */
    @Query("SELECT a FROM GeneratedArticle a WHERE a.user = :user AND a.title LIKE %:keyword%")
    List<GeneratedArticle> searchByTitle(@Param("user") User user, @Param("keyword") String keyword);

    /**
     * 根据内容搜索文章
     */
    @Query("SELECT a FROM GeneratedArticle a WHERE a.user = :user AND (a.title LIKE %:keyword% OR a.content LIKE %:keyword%)")
    List<GeneratedArticle> searchByContent(@Param("user") User user, @Param("keyword") String keyword);

    /**
     * 统计用户的文章数量
     */
    long countByUser(User user);

    /**
     * 统计用户公开文章数量
     */
    long countByUserAndIsPublicTrue(User user);

    /**
     * 增加文章浏览次数
     */
    @Modifying
    @Query("UPDATE GeneratedArticle a SET a.viewCount = a.viewCount + 1 WHERE a.id = :articleId")
    void incrementViewCount(@Param("articleId") Long articleId);

    /**
     * 增加文章分享次数
     */
    @Modifying
    @Query("UPDATE GeneratedArticle a SET a.shareCount = a.shareCount + 1 WHERE a.id = :articleId")
    void incrementShareCount(@Param("articleId") Long articleId);

    /**
     * 查找热门文章（按浏览次数排序）
     */
    @Query("SELECT a FROM GeneratedArticle a WHERE a.isPublic = true ORDER BY a.viewCount DESC")
    List<GeneratedArticle> findPopularArticles(Pageable pageable);

    /**
     * 查找用户的所有分类
     */
    @Query("SELECT DISTINCT a.category FROM GeneratedArticle a WHERE a.user = :user AND a.category IS NOT NULL ORDER BY a.category")
    List<String> findDistinctCategoriesByUser(@Param("user") User user);
}