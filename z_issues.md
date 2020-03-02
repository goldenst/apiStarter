remove consolle logs

models/Courses 
ln 46 console.log("Calculating cost ....".blue);
ln 60 console.log(obj)


** populate is not working
** aggret works but wont post to db  fails in try block ??

what is this error ????
  message:
   'Schema hasn\'t been registered for model "Bootcamp".\nUse mongoose.model(name, schema)',
  name: 'MissingSchemaError' }

controllers/bootcamps.js

line 187
                //make sure it is a photo
   if(!file.mimetype.startsWith('image')){
   return next(new ErrorResponse('Please upload a Photo Image', 400))
   }
  error: TypeError: Cannot read property 'startsWith' of undefined