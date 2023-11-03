pragma solidity ^0.5.0;

contract SocialNetwork {
    string public name;
    uint public postCount = 0;
    uint public demographicCount = 0;

    mapping(uint => Post) public posts;
    mapping(uint => Demographic) public demographics;

    struct Post {
        uint id;
        string content;
        uint tipAmount;
        address payable author;
    }

    event PostCreated(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    event PostTipped(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    struct Demographic {
        string firstName;
        string lastName;
        string dateOfBirth;
        string height;
        string weight;
        string bloodType;
        address payable author;
    }

    event DemographicCreated(
        string firstName,
        string lastName,
        string dateOfBirth,
        string height,
        string weight,
        string bloodType,
        address payable author
    );

    constructor() public {
        name = "Dapp University Social Network";
    }

    function createPost(string memory _content) public {
        // Require valid content
        require(bytes(_content).length > 0);
        // Increment the post count
        postCount ++;
        // Create the post
        posts[postCount] = Post(postCount, _content, 0, msg.sender);
        // Trigger Event
        emit PostCreated(postCount, _content, 0, msg.sender);
    }

    function addDemographic(
        string memory _firstName,
        string memory _lastName,
        string memory _dateOfBirth,
        string memory _height,
        string memory _weight,
        string memory _bloodType
    
    
    ) public {
        // Require valid content
        require(bytes(_firstName).length > 0);
        // Increment the post count
        demographicCount ++;
        // Create the post
        demographics[demographicCount] = Demographic(_firstName, _lastName, _dateOfBirth, _height, _weight, _bloodType, msg.sender);
        emit DemographicCreated(_firstName, _lastName, _dateOfBirth, _height, _weight, _bloodType, msg.sender);

    }

    function tipPost(uint _id) public payable {
        // Make sure the id is valid
        require(_id > 0 && _id <= postCount);
        // Fetch the post
        Post memory _post = posts[_id];
        // Fetch the author
        address payable _author = _post.author;
        // Pay the author
        address(_author).transfer(msg.value);
        // Increment the tip amount
        // 1 Ether = 1000000000000000000 Wei
        _post.tipAmount = _post.tipAmount + msg.value;
        // Update the post
        posts[_id] = _post;
        // Trigger an event
        emit PostTipped(postCount, _post.content, _post.tipAmount, _author);
    }
}