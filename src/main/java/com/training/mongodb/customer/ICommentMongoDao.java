package com.training.mongodb.customer;

import com.training.mongodb.customer.collections.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ICommentMongoDao extends MongoRepository<Comment,String> {
}
