import { brUuid, cfg_cmd_get_bdaddr } from "../utils/constants.js";

export const getBdAddr = (service) => {
  return new Promise((resolve, reject) => {
    var cmd = new Uint8Array(1);
    var cmd_chrc;
    service
      .getCharacteristic(brUuid[3])
      .then((chrc) => {
        cmd_chrc = chrc;
        cmd[0] = cfg_cmd_get_bdaddr;
        return cmd_chrc.writeValue(cmd);
      })
      .then((_) => {
        return cmd_chrc.readValue();
      })
      .then((value) => {
        let bdaddr = value.getUint8(5).toString(16).padStart(2, '0') + ':'
                + value.getUint8(4).toString(16).padStart(2, '0') + ':'
                + value.getUint8(3).toString(16).padStart(2, '0') + ':'
                + value.getUint8(2).toString(16).padStart(2, '0') + ':'
                + value.getUint8(1).toString(16).padStart(2, '0') + ':'
                + value.getUint8(0).toString(16).padStart(2, '0');
        resolve(bdaddr);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default getBdAddr;
