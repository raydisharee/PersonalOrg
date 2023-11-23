import { LightningElement ,api, wire, track} from 'lwc';
import getContactList from '@salesforce/apex/ContactHelper.getContactList';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled }  from 'lightning/empApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ContactTableWithPlatformEvent extends LightningElement {
    subscription = {};
    @api channelName = '/event/dray__Contact__e';
    @track error;
    @track conList =[];
    @track columns = [{
            label: 'Contact name',
            fieldName: 'Name',
            type: 'text',
            sortable: true
        },
        {
            label: 'Email',
            fieldName: 'Email',
            type: 'Email',
            sortable: true
        },
        {
            label: 'is Checked?',
            fieldName: 'dray__Active__c',
            type: 'boolean',
            sortable: 'true',
            fixedWidth: 125
        },
        
    ];

    connectedCallback() {       
        this.handleSubscribe();
    }

    disconnectedCallback() {       
        this.handleUnsubscribe();
    }


    handleSubscribe() {
        const thisReference = this;
        const messageCallback = function(response) {
            console.log('New message received 1: ', JSON.stringify(response));
            console.log('New message received 2: ', response);
            
            var obj = JSON.parse(JSON.stringify(response));
            console.log('New message received 4: ', obj.data.payload.Message__c);
            console.log('New message received 5: ', this.channelName);
            const evt = new ShowToastEvent({
                title: 'Congrats!!',
                message: obj.data.payload.Message__c,
                variant: 'success',
            });

            thisReference.dispatchEvent(evt);
        }
        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, this.messageCallback).then(response => {
            // Response contains the subscription information on subscribe call
            console.log('Subscription request sent to: ', JSON.stringify(response.channel));
            this.subscription = response;
        });
    }

    handleUnsubscribe() {
        unsubscribe(this.subscription, response => {
            console.log('unsubscribe() response: ', JSON.stringify(response));
        });
    }

    messageCallback= (response) =>{
        let conId= response.data.payload.dray__Contact_record_Id__c;
        let conActiveChecked= response.data.payload.dray__Active__c;
        let conName= response.data.payload.dray__Contact_Name__c;
        let existingConList= JSON.parse(JSON.stringify(this.conList));
        for(let i=0; i<existingConList.length; i++){
           if(existingConList[i].Id==conId && existingConList[i].dray__Active__c!=conActiveChecked){
            existingConList[i].dray__Active__c=conActiveChecked;
           }
        }

        const isFound = existingConList.some(element => {
            if (element.Id ===conId) {
              return true;
            }  
            return false;
          });

          if(!isFound) existingConList.unshift({Id:conId,Name:conName,dray__Active__c:conActiveChecked});

          this.conList =existingConList;
          console.log('new Contact list=='+this.conList);

    }
 
    
    @wire(getContactList)
    wiredContact({
        error,
        data
    }) {
        if (data) {
            this.conList = data;
        } else if (error) {
            this.error = error;
        }
    }
}