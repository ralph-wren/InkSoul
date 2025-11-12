package com.inksoul.repository;

import com.inksoul.entity.Category;
import com.inksoul.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 分类数据访问接口
 * 
 * @author InkSoul Team
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * 根据用户查找分类
     */
    List<Category> findByUserOrderBySortOrderAscNameAsc(User user);

    /**
     * 根据用户和分类名称查找分类
     */
    Optional<Category> findByUserAndName(User user, String name);

    /**
     * 查找系统预设分类
     */
    List<Category> findByIsSystemTrueOrderBySortOrderAsc();

    /**
     * 检查分类名称是否存在
     */
    boolean existsByUserAndName(User user, String name);

    /**
     * 统计用户的分类数量
     */
    long countByUser(User user);

    /**
     * 查找有条目的分类
     */
    @Query("SELECT c FROM Category c WHERE c.user = :user AND c.entryCount > 0 ORDER BY c.entryCount DESC")
    List<Category> findCategoriesWithEntries(@Param("user") User user);

    /**
     * 查找空分类
     */
    @Query("SELECT c FROM Category c WHERE c.user = :user AND c.entryCount = 0")
    List<Category> findEmptyCategories(@Param("user") User user);
}