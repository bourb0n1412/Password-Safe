package ch.bbw.hh;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "ch.bbw.hh.repository")
public class PasswordSafeApplication {
    public static void main(String[] args) {
        SpringApplication.run(PasswordSafeApplication.class, args);
    }
}
