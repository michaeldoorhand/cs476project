pragma solidity ^0.8.13;

contract SocialNetwork {
    string public name;
    uint public demographicCount = 0;
    uint public appointmentCount = 0;
    uint public encounterCount = 0;

    mapping(uint => Demographic) public demographics;
    mapping(uint => Appointment) public appointments;
    mapping(uint => Encounter) public encounters;

    struct Demographic {
        uint id;
        string firstName;
        string lastName;
        string dateOfBirth;
        string height;
        string weight;
        string bloodType;
        address payable author;
    }

    event DemographicCreated(
        uint id,
        string firstName,
        string lastName,
        string dateOfBirth,
        string height,
        string weight,
        string bloodType,
        address payable author
    );

    struct Appointment {
        uint id;
        string date;
        string apt_time;
        string location;
        string status;
        string followup;
        string notes;
        address payable author;
    }

    event AppointmentCreated(
        uint id,
        string date,
        string apt_time,
        string location,
        string status,
        string followup,
        string notes,
        address payable author
    );

    struct Encounter {
        uint id;
        string date;
        string location;
        string diagnosis;
        string description;
        string procedure;
        string practitioner;
        address payable author;
    }

    event EncounterCreated(
        uint id,
        string date,
        string location,
        string diagnosis,
        string description,
        string procedure,
        string practitioner,
        address payable author
    );

    function addRecord(
        string memory _field1,
        string memory _field2,
        string memory _field3,
        string memory _field4,
        string memory _field5,
        string memory _field6,
        uint256 _flag
    
    ) public {
        // Require valid content
        require(bytes(_field1).length > 0);
        

        if (_flag == 1) {
            // Increment the post count
            demographicCount ++;
            // Create the post
            demographics[demographicCount] = Demographic(demographicCount, _field1, _field2, _field3, _field4, _field5, _field6, payable(msg.sender));
            emit DemographicCreated(demographicCount, _field1, _field2, _field3, _field4, _field5, _field6, payable(msg.sender));
        }
        if (_flag == 2) {
            // Increment the post count
            appointmentCount ++;
            // Create the post
            appointments[appointmentCount] = Appointment(appointmentCount, _field1, _field2, _field3, _field4, _field5, _field6, payable(msg.sender));
            emit AppointmentCreated(appointmentCount, _field1, _field2, _field3, _field4, _field5, _field6, payable(msg.sender));
        }
        if (_flag == 3) {
            // Increment the post count
            encounterCount ++;
            // Create the post
            encounters[encounterCount] = Encounter(encounterCount, _field1, _field2, _field3, _field4, _field5, _field6, payable(msg.sender));
            emit EncounterCreated(encounterCount, _field1, _field2, _field3, _field4, _field5, _field6, payable(msg.sender));
        }
       
    }
    
}