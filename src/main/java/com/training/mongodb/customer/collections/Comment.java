package com.training.mongodb.customer.collections;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "customer_comments")
public class Comment {

    @Id
    private String id;
    private String desc;
    private Integer like;

}
