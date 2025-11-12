package com.inksoul;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * 笔心 · InkSoul 应用主启动类
 * 
 * @author InkSoul Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
public class InkSoulApplication {

    public static void main(String[] args) {
        SpringApplication.run(InkSoulApplication.class, args);
    }
}