const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;
const EVENT_ATTACK = "ATTACK";
const EVENT_STRONG_ATTACK = "STRONG ATTACK";
const EVENT_MONSTER_ATTACK = "MONSTER ATTACK";
const EVENT_HEAL = "HEAL";
const EVENT_GAME_OVER = "GAME OVER";

let totalStrongAttacks = 3;
let totalHeals = 3;
const battleLog = [];
const userChosenHealth = prompt("Maximum life for you and the monster:", "100");

let chosenMaxHealth = parseInt(userChosenHealth);

if (isNaN(chosenMaxHealth) || chosenMaxHealth <= 0) {
  chosenMaxHealth = 100;
}

let hasBonusLife = true;
let currentMonsterHealth = chosenMaxHealth;
let currentPlayerHealth = chosenMaxHealth;

adjustHealthBars(chosenMaxHealth);

function writeToLog(
  event,
  value,
  target,
  finalMonsterHealth,
  finalPlayerHealth
) {
  let logEntry = {
    event: event,
    value: value,
    target: target,
    finalMonsterHealth: finalMonsterHealth,
    finalPlayerHealth: finalPlayerHealth,
  };

  battleLog.push(logEntry);
}

function reset() {
  currentMonsterHealth = chosenMaxHealth;
  currentPlayerHealth = chosenMaxHealth;
  resetGame(chosenMaxHealth);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    EVENT_MONSTER_ATTACK,
    playerDamage,
    "PLAYER",
    currentMonsterHealth,
    currentPlayerHealth
  );
  if (currentPlayerHealth <= 0 && hasBonusLife) {
    removeBonusLife();
    hasBonusLife = false;
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("Bonus life activated, you're saved!");
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won!");
    writeToLog(
      EVENT_GAME_OVER,
      "You Won",
      "N/A",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You lost!");
    writeToLog(
      EVENT_GAME_OVER,
      "You Lost",
      "N/A",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("Draw!");
    writeToLog(
      EVENT_GAME_OVER,
      "DRAW",
      "N/A",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  if (currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
    reset();
  }
}

function attackMonster(attackMode) {
  let damageType;
  let attackEvent;
  if (attackMode === "STRONG") {
    if (totalStrongAttacks > 0) {
      --totalStrongAttacks;
      damageType = STRONG_ATTACK_VALUE;
      attackEvent = EVENT_STRONG_ATTACK;
    } else {
      alert("You don't have any strong attacks left!");
    }
  } else if (attackMode === "NORMAL") {
    damageType = ATTACK_VALUE;
    attackEvent = EVENT_ATTACK;
  }
  const damage = dealMonsterDamage(damageType);
  currentMonsterHealth -= damage;
  writeToLog(
    attackEvent,
    damage,
    "MONSTER",
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function handleAttack() {
  attackMonster("NORMAL");
}

function handleStrongAttack() {
  attackMonster("STRONG");
}

function handleHeal() {
  let healValue;
  if (currentPlayerHealth <= chosenMaxHealth - HEAL_VALUE && totalHeals > 0) {
    totalHeals--;
    healValue = HEAL_VALUE;
  } else if (
    currentPlayerHealth > chosenMaxHealth - HEAL_VALUE &&
    totalHeals > 0
  ) {
    totalHeals--;
    healValue = chosenMaxHealth - currentPlayerHealth;
  } else if (totalHeals <= 0) {
    alert("You don't have any heals left!");
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;

  writeToLog(
    EVENT_HEAL,
    HEAL_VALUE,
    "PLAYER",
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function handleLogClick() {
  let i = 0;
  for (const log of battleLog) {
    i++;
    console.log(i + ".event");
    for (const singleLog in log) {
      console.log(`${singleLog} ==>> ${log[singleLog]}`);
    }
  }
}

logBtn.addEventListener("click", handleLogClick);
attackBtn.addEventListener("click", handleAttack);
strongAttackBtn.addEventListener("click", handleStrongAttack);
healBtn.addEventListener("click", handleHeal);
