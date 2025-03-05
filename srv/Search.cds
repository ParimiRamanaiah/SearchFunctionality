using myapp from '../db/schema';

service UserService {
    entity Users as projection on myapp.User;

    function users(searchValue:String) returns array of {};

    
}
