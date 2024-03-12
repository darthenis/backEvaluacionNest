import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Rol } from "../interfaces/rol.enum";


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

    birthday: string;

    phone:    string;

    date:     string;
    
    @Prop({ type: String, enum: Rol, default: Rol.USER })
    rol : Rol;

}

export const userSchema = SchemaFactory.createForClass( User );
