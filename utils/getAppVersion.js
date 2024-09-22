import ChromeSamples from "./ChromeSamples.js";
import { brUuid, cfg_cmd_get_fw_ver } from "../utils/constants.js";

export const getAppVersion = (service) => {
  return new Promise((resolve, reject) => {
    var cmd = new Uint8Array(1);
    var cmd_chrc;
    service
      .getCharacteristic(brUuid[2])
      .then((chrc) => {
        cmd_chrc = chrc;
        cmd[0] = cfg_cmd_get_fw_ver;
        return cmd_chrc.writeValue(cmd);
      })
      .then((_) => {
        return cmd_chrc.readValue();
      })
      .then((value) => {
        let enc = new TextDecoder("utf-8");
        let app_ver = enc.decode(value);
        resolve(app_ver);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default getAppVersion;
