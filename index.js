async function getDepositCircuitBytecode() {
  const { bytecode } = require("./circuits/deposit/target/deposit.json");
  return bytecode;
}

async function generateVkWithCliBB() {
  const { execSync } = require("child_process");
  const fs = require("fs");

  const input = "./circuits/deposit/target/deposit.json";
  const output = "./circuits/deposit/target/vk";

  execSync(`bb write_vk -b ${input} -o ${output}`);
  const vk = fs.readFileSync(output).toString("hex");

  return vk;
}

async function generateVkWithNodeJSBB() {
  const { UltraPlonkBackend } = require("@aztec/bb.js");

  const bytecode = await getDepositCircuitBytecode();
  const generator = new UltraPlonkBackend(bytecode);
  const vk = await generator.getVerificationKey();
  const vkHex = Buffer.from(vk).toString("hex");

  return vkHex;
}

async function main() {
  const vkCliBB = await generateVkWithCliBB();
  const vkNodeJSBB = await generateVkWithNodeJSBB();

  console.log("vkCliBB: ", vkCliBB, "\n");
  console.log("vkNodeJSBB: ", vkNodeJSBB, "\n");
}

main();
