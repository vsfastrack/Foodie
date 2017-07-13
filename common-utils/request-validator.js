module.exports = {
    validate_request : function validateRequest(tergetObject , keyProperty ,callback){
        var emptyFields = new Array();
        var class_Size = keyProperty.length;
        for (var index = 0 ;index < class_Size ; index++){
            if(Reflect.has(tergetObject , keyProperty[index]))
              emptyFields.push(keyProperty[index]);
        }
        callback(emptyFields);
    }
}