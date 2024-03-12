import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Role } from "../interfaces/role.enum";


@Schema({_id: false})
class Address {

    @Prop({required: true})
    street:   string;

    @Prop({required: true})
    location: string;

    @Prop({required: true})
    city:     string;

    @Prop({required: true})
    country:  string;

    @Prop({required: true, minlength: 4})
    cp:       string;

}

const AddressSchema = SchemaFactory.createForClass( Address )


@Schema()
export class User {

    _id?: string;

    @Prop({required: true})
    name:     string;

    @Prop({required: true, unique: true})
    email:     string;
    
    @Prop({type: AddressSchema })
    address: Address;

    @Prop({required: true, minlength: 8})
    password?: string;

    @Prop({required: true})
    birthday: string;

    @Prop({required: true})
    phone:    string;

    @Prop({required:false, default: null})
    profileUrl: string;

    @Prop({ type: String, enum: Role, default: Role.USER })
    role : Role;

}

export const userSchema = SchemaFactory.createForClass( User );
