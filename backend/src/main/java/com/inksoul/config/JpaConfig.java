package com.inksoul.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * JPA配置类
 * 
 * @author InkSoul Team
 */
@Configuration
@EnableJpaRepositories(basePackages = "com.inksoul.repository")
@EnableJpaAuditing
@EnableTransactionManagement
public class JpaConfig {
    // JPA相关配置
}