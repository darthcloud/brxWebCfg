import ChromeSamples from "./ChromeSamples.js"
import { brUuid, cfg_cmd_get_abi_ver } from "../utils/constants.js";

export const getApiVersion = (service) => {
    return new Promise((resolve, reject) => {
      var cmd = new Uint8Array(1);
      var cmd_chrc;
      service
        .getCharacteristic(brUuid[2])
        .then((chrc) => {
          cmd_chrc = chrc;
          cmd[0] = cfg_cmd_get_abi_ver;
          return cmd_chrc.writeValue(cmd);
        })
        .then((_) => {
          return cmd_chrc.readValue();
        })
        .then((value) => {
          resolve(value.getUint8(0));
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  export default getApiVersion;