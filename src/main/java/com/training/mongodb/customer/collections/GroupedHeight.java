package com.training.mongodb.customer.collections;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupedHeight {

    private String _id;
    private Integer total;
    private Double avg_weight;
    private Integer total_weight;
}
