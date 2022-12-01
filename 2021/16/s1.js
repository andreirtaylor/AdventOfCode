const {strict: assert} = require('assert');

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
        value.push(...group.slice(1, GROUP_SIZE));
        offset += GROUP_SIZE;
        group = packet.slice(offset, offset + GROUP_SIZE);
      }
      value.push(...group.slice(1, GROUP_SIZE));

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
      offset = iBit ? 18 : 22;

      let len = parseInt((iBit ? packet.slice(7, 18) : packet.slice(7, 22)).join(''), 2);

      let currOffset = offset;
      // this tests if you know the length you want to offset by
      // if you do then go until you have reached tha offset, otherwise run this
      // len times when len is the value read from the i bit + 11 spaces.
      while (!iBit ? currOffset < offset + len : len--) {
        let {version: ver, value: val, offset: off} = processPacket(packet.slice(currOffset));
        currOffset += off;
        version += ver;
      }
      offset = currOffset;

      return {version, value, offset};
    default:
      break;
  }
};

assert.deepEqual(processPacket(strToBin('38006F45291200')), {version: 9, value: 0, offset: 49});
assert.deepEqual(processPacket(strToBin('000000000000000000000000')), {
  version: 0,
  value: 0,
  offset: 96,
});
assert.deepEqual(processPacket(strToBin('00000000000000')), {version: 0, value: 0, offset: 56});
assert.deepEqual(processPacket(strToBin('0000')), {version: 0, value: 0, offset: 16});
assert.deepEqual(processPacket(strToBin('D2FE28')), {version: 6, value: 2021, offset: 21});
assert.deepEqual(processPacket(strToBin('EE00D40C823060')), {version: 14, value: 0, offset: 51});
assert.deepEqual(processPacket(strToBin('8A004A801A8002F478')), {
  version: 16,
  value: 0,
  offset: 69,
});
assert.deepEqual(processPacket(strToBin('620080001611562C8802118E34')), {
  version: 12,
  value: 0,
  offset: 102,
});
7 + 2 + 4 + 1;
assert.deepEqual(processPacket(strToBin('C0015000016115A2E0802F182340')), {
  version: 23,
  value: 0,
  offset: 106,
});
assert.deepEqual(processPacket(strToBin('A0016C880162017C3686B18A3D4780')), {
  version: 31,
  value: 0,
  offset: 113,
});

console.log(
  processPacket(
    strToBin(
      '00569F4A0488043262D30B333FCE6938EC5E5228F2C78A017CD78C269921249F2C69256C559CC01083BA00A4C5730FF12A56B1C49A480283C0055A532CF2996197653005FC01093BC4CE6F5AE49E27A7532200AB25A653800A8CAE5DE572EC40080CD26CA01CAD578803CBB004E67C573F000958CAF5FC6D59BC8803D1967E0953C68401034A24CB3ACD934E311004C5A00A4AB9CAE99E52648401F5CC4E91B6C76801F59DA63C1F3B4C78298014F91BCA1BAA9CBA99006093BFF916802923D8CC7A7A09CA010CD62DF8C2439332A58BA1E495A5B8FA846C00814A511A0B9004C52F9EF41EC0128BF306E4021FD005CD23E8D7F393F48FA35FCE4F53191920096674F66D1215C98C49850803A600D4468790748010F8430A60E1002150B20C4273005F8012D95EC09E2A4E4AF7041004A7F2FB3FCDFA93E4578C0099C52201166C01600042E1444F8FA00087C178AF15E179802F377EC695C6B7213F005267E3D33F189ABD2B46B30042655F0035300042A0F47B87A200EC1E84306C801819B45917F9B29700AA66BDC7656A0C49DB7CAEF726C9CEC71EC5F8BB2F2F37C9C743A600A442B004A7D2279125B73127009218C97A73C4D1E6EF64A9EFDE5AF4241F3FA94278E0D9005A32D9C0DD002AB2B7C69B23CCF5B6C280094CE12CDD4D0803CF9F96D1F4012929DA895290FF6F5E2A9009F33D796063803551006E3941A8340008743B8D90ACC015C00DDC0010B873052320002130563A4359CF968000B10258024C8DF2783F9AD6356FB6280312EBB394AC6FE9014AF2F8C381008CB600880021B0AA28463100762FC1983122D2A005CBD11A4F7B9DADFD110805B2E012B1F4249129DA184768912D90B2013A4001098391661E8803D05612C731007216C768566007280126005101656E0062013D64049F10111E6006100E90E004100C1620048009900020E0006DA0015C000418000AF80015B3D938'
    )
  )
);
