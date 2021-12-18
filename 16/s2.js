const {strict: assert} = require('assert');
const {Graph} = require('datastructures-js');
const fs = require('fs');
const {off} = require('process');
const data = fs.readFileSync('./testInput.txt', {
  encoding: 'utf8',
  flag: 'r',
});

const hexToBin = {
  1: '0001',
  2: '0010',
  3: '0011',
  4: '0100',
  5: '0101',
  6: '0110',
  7: '0111',
  8: '1000',
  9: '1001',
  A: '1010',
  B: '1011',
  C: '1100',
  D: '1101',
  E: '1110',
  F: '1111',
  0: '0000',
};

const strToBin = str =>
  str
    .split('')
    .map(x => hexToBin[x])
    .join('')
    .split('');

const GROUP_SIZE = 5;

const processPacket = packet => {
  if (!packet.length || packet.every(c => c == '0'))
    return {version: 0, offset: packet.length, value: 0};
  let version = parseInt(packet.slice(0, 3).join(''), 2);
  //console.log('top level', version, packet.join(''));
  const type = parseInt(packet.slice(3, 6).join(''), 2);
  const iBit = packet[6] === '1';
  let value = 0;

  let offset = 7;
  switch (type) {
    case 4:
      // this type of packet does not have the I bit
      offset = 6;
      value = [];
      let group = packet.slice(offset, offset + GROUP_SIZE);
      while (group[0] != 0) {
        //console.log(version, type, value, group, ...group.slice(1, GROUP_SIZE));
        value.push(...group.slice(1, GROUP_SIZE));
        offset += GROUP_SIZE;
        group = packet.slice(offset, offset + GROUP_SIZE);
      }
      value.push(...group.slice(1, GROUP_SIZE));
      //console.log(version, type, value);

      value = parseInt(value.join(''), 2);
      offset += GROUP_SIZE;
      return {version, offset, value};
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
      //console.log(iBit, iBit ? packet.slice(7, 18) : packet.slice(7, 22));
      offset = iBit ? 18 : 22;
      const values = [];

      let len = parseInt((iBit ? packet.slice(7, 18) : packet.slice(7, 22)).join(''), 2);
      //console.log(iBit, len, version);

      let currOffset = offset;
      while (!iBit ? currOffset < offset + len : len--) {
        //console.log('packet', packet, packet.slice(7, 18));
        let {version: ver, value: val, offset: off} = processPacket(packet.slice(currOffset));
        //console.log(iBit, len, ver, val, off);
        values.push(val);
        currOffset += off;
        version += ver;
      }
      offset = currOffset;
      //console.log(type);
      value = typeFunc[type](values);
      return {version, value, offset};
    default:
      break;
  }
};

// hoist this bad boy
var typeFunc = {
  0: values => values.reduce((p, c) => p + c, 0),
  1: values => values.reduce((p, c) => p * c, 1),
  2: values => Math.min(...values),
  3: values => Math.max(...values),
  5: ([l, r]) => (l > r ? 1 : 0),
  6: ([l, r]) => (l < r ? 1 : 0),
  7: ([l, r]) => (l == r ? 1 : 0),
};

assert.deepEqual(processPacket(strToBin('C200B40A82')).value, 3);
assert.deepEqual(processPacket(strToBin('04005AC33890')).value, 54);
assert.deepEqual(processPacket(strToBin('880086C3E88112')).value, 7);
assert.deepEqual(processPacket(strToBin('CE00C43D881120')).value, 9);
assert.deepEqual(processPacket(strToBin('D8005AC2A8F0')).value, 1);
assert.deepEqual(processPacket(strToBin('F600BC2D8F')).value, 0);
assert.deepEqual(processPacket(strToBin('9C005AC2F8F0')).value, 0);
assert.deepEqual(processPacket(strToBin('9C0141080250320F1802104A08')).value, 1);

console.log(
  processPacket(
    strToBin(
      '00569F4A0488043262D30B333FCE6938EC5E5228F2C78A017CD78C269921249F2C69256C559CC01083BA00A4C5730FF12A56B1C49A480283C0055A532CF2996197653005FC01093BC4CE6F5AE49E27A7532200AB25A653800A8CAE5DE572EC40080CD26CA01CAD578803CBB004E67C573F000958CAF5FC6D59BC8803D1967E0953C68401034A24CB3ACD934E311004C5A00A4AB9CAE99E52648401F5CC4E91B6C76801F59DA63C1F3B4C78298014F91BCA1BAA9CBA99006093BFF916802923D8CC7A7A09CA010CD62DF8C2439332A58BA1E495A5B8FA846C00814A511A0B9004C52F9EF41EC0128BF306E4021FD005CD23E8D7F393F48FA35FCE4F53191920096674F66D1215C98C49850803A600D4468790748010F8430A60E1002150B20C4273005F8012D95EC09E2A4E4AF7041004A7F2FB3FCDFA93E4578C0099C52201166C01600042E1444F8FA00087C178AF15E179802F377EC695C6B7213F005267E3D33F189ABD2B46B30042655F0035300042A0F47B87A200EC1E84306C801819B45917F9B29700AA66BDC7656A0C49DB7CAEF726C9CEC71EC5F8BB2F2F37C9C743A600A442B004A7D2279125B73127009218C97A73C4D1E6EF64A9EFDE5AF4241F3FA94278E0D9005A32D9C0DD002AB2B7C69B23CCF5B6C280094CE12CDD4D0803CF9F96D1F4012929DA895290FF6F5E2A9009F33D796063803551006E3941A8340008743B8D90ACC015C00DDC0010B873052320002130563A4359CF968000B10258024C8DF2783F9AD6356FB6280312EBB394AC6FE9014AF2F8C381008CB600880021B0AA28463100762FC1983122D2A005CBD11A4F7B9DADFD110805B2E012B1F4249129DA184768912D90B2013A4001098391661E8803D05612C731007216C768566007280126005101656E0062013D64049F10111E6006100E90E004100C1620048009900020E0006DA0015C000418000AF80015B3D938'
    )
  )
);
