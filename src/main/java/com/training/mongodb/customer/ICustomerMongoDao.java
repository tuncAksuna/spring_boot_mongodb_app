package com.training.mongodb.customer;

import com.training.mongodb.customer.collections.Customer;
import com.training.mongodb.customer.collections.GroupedHeight;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ICustomerMongoDao extends MongoRepository<Customer, String> {

    List<Customer> findAllByFirstName(String name);

    List<Customer> findAllByFirstNameAndLastName(String name, String surname);

    List<Customer> findAllByWeightBetween(Integer min, Integer max);

    @Query("{firstName: ?0}")
    List<Customer> searchCustomerWithFirstName(String name);

    @Query(value = "{lastName: ?0}",
            fields = "{firstName : 1,lastName : 1}")
    List<Customer> searchCustomerWithLastName(String surname);

    @Aggregation(pipeline = {
            "{'$match': { 'last_name': ?0 }}",
            "{'$sort': { 'firstName' : 1}}"
    })
    List<Customer> aggregateWithMatch(String lastname);

    @Aggregation(pipeline = {
            "{'$group': {'_id': '$height', 'total': {'$sum': 1},'avg_weight': {'$avg': '$weight'},'total_weight': {'$sum': '$weight'} }}",
            "{'$sort': { '_id' : 1}}"
    })
    List<GroupedHeight> aggregateWithGroup();

}
