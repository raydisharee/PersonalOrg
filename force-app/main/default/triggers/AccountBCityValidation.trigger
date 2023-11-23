trigger AccountBCityValidation on Account (before insert) {
    for(Account acc : trigger.new){
        if(acc.BillingCity ==Null) acc.addError('Billing City Blank error from trigger!');
    }
}