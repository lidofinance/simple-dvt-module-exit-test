# Ejector test script

## Script

### 0. Run the script

```sh
./run.sh
```

### 1. Run anvil

The script will suggest you to run anvil. You will need INFURA_KEY or another RPC provider:

```sh
anvil --fork-url https://mainnet.infura.io/v3/$INFURA_KEY
```

### 2. Run docker compose

Then it will suggest you to run docker-compose with ejector and simple proxy to mock some CL endpoints:

```sh
export CL_NODE_URL=$CL_NODE_URL && docker-compose -f docker-compose.yml up
```

After running ejector, you should see the following entry in the logs:

```log
Job started {"operatorId":"0","stakingModuleId":"2","loadedMessages":1}
```

### 3. Oracle report

After all transactions on fork have passed and the report has been delivered, Validator Exit Bus Oracle will emit the Validator Exit event and the ejector should handle it. You should see the following entry in the logs:

```log
info: Voluntary exit message sent successfully to Consensus Layer {"validatorIndex":"1000000","validatorPubkey":"0x96894385d430166da55c24f8fa7e663ef179a94285939c5f733ab37003908ae58fce5848cc58c270b9544739b9b6b904"}
```

## Files

### Validator keys
`./keystore` is generated with https://github.com/ethereum/staking-deposit-cli for mainnet network, this pubkey is used in the follow scripts

### Ejector messages
`ejector-messages/test_validator.json` - signed exit message for validator with index 1000000 (fake one to avoid a real deposit). signed with private key of the generated validator via web3signer. Message is not encrypted, it's ok for testing purposes but not for production

### Docker compose

It runs Ejector and a simple proxy server

### Simple proxy

Simple proxy mocks some requests to CL node: info for testing validator and voluntary_exits endpoint.  
Here you can see the source code of the server (only 37 lines): [simple-proxy/index.js](simple-proxy/index.js).

[simple-proxy/mock_validator.json](simple-proxy/mock_validator.json) - mock response for validator endpoint.