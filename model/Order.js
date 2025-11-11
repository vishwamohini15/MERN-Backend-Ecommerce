const mongoose=require('mongoose')

const {Schema}=mongoose

const OrderSchema=new Schema({
     items:{type:[Schema.Types.Mixed], require:true},
     totalAmount: {type : Number},
     totalItems: {type : Number},
      user: {type : Schema.Types.ObjectId, ref:'User', require:true},
     paymentMethod: {type: String, require:true},
     status: {type: String, default:'pending'},
     selectedAddress : {type:Schema.Types.Mixed, require:true}

})

const virtual = OrderSchema.virtual('id')
virtual.get(function(){
   return this._id
})

OrderSchema.set('toJSON',{
   virtuals:true,
   versionKey:false,
   transform:function (doc, ret){delete ret._id}
})

exports.Order = mongoose.model('Order', OrderSchema)
