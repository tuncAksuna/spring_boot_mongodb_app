package com.training.mongodb.customer.collections;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Phone {
    @Field("phone_name")
    @NotNull
    @NotEmpty
    private String phoneName;

    @Field("phone_number")
    @NotNull
    @NotEmpty
    private String phoneNumber;
}
