// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AbstractPvPCombat {
    enum Move { Sword, Shield, Magic }
    
    struct Duel {
        address player1;
        address player2;
        uint256 stake;
        uint256 totalRounds;
        uint256 currentRound;
        uint256 player1Wins;
        uint256 player2Wins;
        bytes32 player1Commit;
        bytes32 player2Commit;
        Move player1Move;
        Move player2Move;
        bool player1Revealed;
        bool player2Revealed;
        bool active;
        address winner;
    }
    
    uint256 public constant HOUSE_FEE_PERCENT = 300; // 3%
    uint256 public duelCounter;
    
    mapping(uint256 => Duel) public duels;
    mapping(address => uint256[]) public playerDuels;
    
    event DuelCreated(uint256 indexed duelId, address indexed player1, uint256 stake);
    event DuelJoined(uint256 indexed duelId, address indexed player2);
    event MoveCommitted(uint256 indexed duelId, address indexed player);
    event MoveRevealed(uint256 indexed duelId, address indexed player, Move move);
    event RoundCompleted(uint256 indexed duelId, uint256 round, address winner);
    event DuelCompleted(uint256 indexed duelId, address winner, uint256 reward);
    
    function createDuel(uint256 totalRounds) external payable {
        require(msg.value > 0, "Stake must be greater than 0");
        require(totalRounds >= 3 && totalRounds <= 7, "Invalid round count");
        
        uint256 houseFee = (msg.value * HOUSE_FEE_PERCENT) / 10000;
        uint256 playerStake = msg.value - houseFee;
        
        duelCounter++;
        duels[duelCounter] = Duel({
            player1: msg.sender,
            player2: address(0),
            stake: playerStake,
            totalRounds: totalRounds,
            currentRound: 0,
            player1Wins: 0,
            player2Wins: 0,
            player1Commit: bytes32(0),
            player2Commit: bytes32(0),
            player1Move: Move.Sword,
            player2Move: Move.Sword,
            player1Revealed: false,
            player2Revealed: false,
            active: true,
            winner: address(0)
        });
        
        playerDuels[msg.sender].push(duelCounter);
        
        emit DuelCreated(duelCounter, msg.sender, playerStake);
    }
    
    function joinDuel(uint256 duelId) external payable {
        Duel storage duel = duels[duelId];
        require(duel.player2 == address(0), "Duel already has two players");
        require(duel.active, "Duel not active");
        require(msg.value == duel.stake, "Incorrect stake amount");
        
        duel.player2 = msg.sender;
        playerDuels[msg.sender].push(duelId);
        
        emit DuelJoined(duelId, msg.sender);
    }
    
    function commitMove(uint256 duelId, bytes32 moveHash) external {
        Duel storage duel = duels[duelId];
        require(duel.active, "Duel not active");
        require(msg.sender == duel.player1 || msg.sender == duel.player2, "Not a player");
        require(duel.currentRound < duel.totalRounds, "Duel completed");
        
        if (msg.sender == duel.player1) {
            require(duel.player1Commit == bytes32(0), "Already committed");
            duel.player1Commit = moveHash;
        } else {
            require(duel.player2Commit == bytes32(0), "Already committed");
            duel.player2Commit = moveHash;
        }
        
        emit MoveCommitted(duelId, msg.sender);
        
        // Start new round if both players committed
        if (duel.player1Commit != bytes32(0) && duel.player2Commit != bytes32(0)) {
            duel.currentRound++;
            duel.player1Commit = bytes32(0);
            duel.player2Commit = bytes32(0);
            duel.player1Revealed = false;
            duel.player2Revealed = false;
        }
    }
    
    function revealMove(uint256 duelId, Move move, bytes32 salt) external {
        Duel storage duel = duels[duelId];
        require(duel.active, "Duel not active");
        require(msg.sender == duel.player1 || msg.sender == duel.player2, "Not a player");
        require(duel.currentRound > 0, "No active round");
        
        bytes32 moveHash = keccak256(abi.encodePacked(move, salt));
        
        if (msg.sender == duel.player1) {
            require(!duel.player1Revealed, "Already revealed");
            require(moveHash == duel.player1Commit, "Invalid move");
            duel.player1Move = move;
            duel.player1Revealed = true;
        } else {
            require(!duel.player2Revealed, "Already revealed");
            require(moveHash == duel.player2Commit, "Invalid move");
            duel.player2Move = move;
            duel.player2Revealed = true;
        }
        
        emit MoveRevealed(duelId, msg.sender, move);
        
        // Process round if both players revealed
        if (duel.player1Revealed && duel.player2Revealed) {
            _processRound(duelId);
        }
    }
    
    function _processRound(uint256 duelId) internal {
        Duel storage duel = duels[duelId];
        
        address roundWinner = _determineWinner(duel.player1Move, duel.player2Move);
        
        if (roundWinner == duel.player1) {
            duel.player1Wins++;
        } else if (roundWinner == duel.player2) {
            duel.player2Wins++;
        }
        
        emit RoundCompleted(duelId, duel.currentRound, roundWinner);
        
        // Check if duel is complete
        uint256 roundsToWin = (duel.totalRounds + 1) / 2;
        if (duel.player1Wins >= roundsToWin || duel.player2Wins >= roundsToWin) {
            _completeDuel(duelId);
        }
    }
    
    function _determineWinner(Move move1, Move move2) internal pure returns (address) {
        if (move1 == move2) {
            return address(0); // Tie
        }
        
        // Sword beats Magic, Magic beats Shield, Shield beats Sword
        if ((move1 == Move.Sword && move2 == Move.Magic) ||
            (move1 == Move.Magic && move2 == Move.Shield) ||
            (move1 == Move.Shield && move2 == Move.Sword)) {
            return address(1); // Player 1 wins
        }
        
        return address(2); // Player 2 wins
    }
    
    function _completeDuel(uint256 duelId) internal {
        Duel storage duel = duels[duelId];
        duel.active = false;
        
        address winner;
        if (duel.player1Wins > duel.player2Wins) {
            winner = duel.player1;
        } else {
            winner = duel.player2;
        }
        
        duel.winner = winner;
        
        // Transfer winnings
        uint256 totalReward = duel.stake * 2;
        payable(winner).transfer(totalReward);
        
        emit DuelCompleted(duelId, winner, totalReward);
    }
    
    function getPlayerDuels(address player) external view returns (uint256[] memory) {
        return playerDuels[player];
    }
    
    function getDuelDetails(uint256 duelId) external view returns (Duel memory) {
        return duels[duelId];
    }
    
    // Emergency withdrawal for contract owner
    function withdrawHouseFees() external {
        require(msg.sender == owner(), "Not owner");
        payable(owner()).transfer(address(this).balance);
    }
    
    function owner() internal view returns (address) {
        // Replace with actual owner address
        return address(0x1234567890123456789012345678901234567890);
    }
}
