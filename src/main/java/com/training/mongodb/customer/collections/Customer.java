package com.training.mongodb.customer.collections;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Document
public class Customer {

    @Builder(setterPrefix = "with")
    public Customer(final String firstNameParam,
                    final String lastNameParam,
                    final Integer weightParam,
                    final Integer heightParam) {
        firstName = firstNameParam;
        lastName  = lastNameParam;
        weight    = weightParam;
        height    = heightParam;
    }

    @Id
    @JsonIgnore
    private String id;

    @NotNull
    @NotEmpty
    @Field(name = "first_name")
    private String firstName;

    @NotNull
    @NotEmpty
    @Field(name = "last_name")
    private String lastName;

    @NotNull
    @Field(name = "weight")
    private Integer weight;

    @NotNull
    @Field(name = "height")
    private Integer height;

    @NotNull
    @Size(min = 1)
    @Field(name = "phones")
    @Valid
    private List<Phone> phones;

    @DBRef
    private List<Comment> comments;


}
