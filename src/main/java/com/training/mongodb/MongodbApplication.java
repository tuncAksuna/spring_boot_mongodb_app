package com.training.mongodb;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class MongodbApplication {

    public static void main(String[] args) {
        SpringApplication.run(MongodbApplication.class,
                              args);
    }

    @Bean
     public OpenAPI customOpenApi(@Value("${application-description}") String description,
                                  @Value("${application-version}") String version){
    return new OpenAPI()
            .info(new Info())
            .title("Spring boot MongoDB API")
            .version(version)
            .description(description)
            .license(new License().name("tunCode API Licence"));
    }
}
