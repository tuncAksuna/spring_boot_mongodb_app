package com.training.mongodb.customer.api;

import com.training.mongodb.customer.ICommentMongoDao;
import com.training.mongodb.customer.ICustomerMongoDao;
import com.training.mongodb.customer.collections.Comment;
import com.training.mongodb.customer.collections.Customer;
import com.training.mongodb.customer.collections.GroupedHeight;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customer/management")
public class CustomerRest {

    @Autowired
    private ICustomerMongoDao customerMongoDao;

    @Autowired
    private ICommentMongoDao commentMongoDao;

    @PostMapping("/add")
    public String add(@Valid @RequestBody Customer customerParam) {
        List<Comment> commentsLoc = customerParam.getComments();
        if (commentsLoc != null && !commentsLoc.isEmpty()) {
            commentMongoDao.saveAll(commentsLoc);
        }
        customerMongoDao.save(customerParam);
        return customerParam.getId();
    }

    @GetMapping("/get/all")
    public List<Customer> getAllCustomer() {
        return customerMongoDao.findAll();
    }

    @GetMapping("/get/by/name")
    public List<Customer> getByName(@RequestParam("name") String name) {
        return customerMongoDao.findAllByFirstName(name);
    }

    @GetMapping("/get/by/nameandsurname")
    public List<Customer> getByName(@RequestParam("name") String name,
                                    @RequestParam("surname") String surname) {
        return customerMongoDao.findAllByFirstNameAndLastName(name, surname);
    }

    @GetMapping("/get/by/weight/between")
    public List<Customer> getByName(@RequestParam("min") Integer min,
                                    @RequestParam("max") Integer max) {
        return customerMongoDao.findAllByWeightBetween(min, max);
    }

    @GetMapping("/get/by/name2")
    public List<Customer> getByName2(@RequestParam("name") String name) {
        return customerMongoDao.searchCustomerWithFirstName(name);
    }

    @GetMapping("/get/by/surname")
    public List<Customer> getBySurname(@RequestParam("surname") String surname) {
        return customerMongoDao.searchCustomerWithLastName(surname);
    }

    @GetMapping("/agg/by/surname")
    public List<Customer> aggBySurname(@RequestParam("lastname") String surname) {
        return customerMongoDao.aggregateWithMatch(surname);
    }

    @GetMapping("/agg/group/height")
    public List<GroupedHeight> aggBySurname() {
        return customerMongoDao.aggregateWithGroup();
    }

    @GetMapping("/getCustomerCount")
    public List<?> getCustomerCount(){
        return customerMongoDao.aggregateGetCustomerCount();
    }

}
