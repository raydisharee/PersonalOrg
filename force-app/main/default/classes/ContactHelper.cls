public with sharing class ContactHelper {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList() {
        return [SELECT Id, Name, dray__Active__c,Email  FROM Contact ORDER BY LastModifiedDate DESC LIMIT 25];
    }
}