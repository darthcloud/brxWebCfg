import { brUuid, labelName, btnList, turboMask, maxMax, maxThres }
    from './utils/constants.js';
import { getAppVersion } from './utils/getAppVersion.js';
import { getBdAddr } from './utils/getBdAddr.js';
import { getApiVersion } from './utils/getApiVersion.js';

var apiVersion = 0;
var bluetoothDevice;
var maxMapping = 255;
var nbMapping = 1;
let brService = null;
var mappingElement = null;
var srcLabel = 12;
var destLabel = 18;
var bdaddr = '';
var app_ver = '';
var name = '';

function initInputSelect() {
    var divInputCfg = document.getElementById("divInputCfg");

    divInputCfg.innerHTML = '';

    let header = document.createElement("h2");
    header.style.margin = 0;
    header.innerText = 'Mapping Config';

    divInputCfg.appendChild(header);

    var div = document.createElement("div");
    div.setAttribute("style", "margin-bottom:1em;");

    /* Input select */
    var label = document.createElement("label");
    label.innerText = 'Select custom mapping bank: ';
    label.setAttribute("for", "inputSelect");

    var main = document.createElement("select");
    for (var i = 0; i < 4; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = "Bank " + (i + 1);
        main.add(option);
    }
    main.id = "inputSelect";
    main.addEventListener("change", selectInput);
    div.appendChild(label);
    div.appendChild(main);

    divInputCfg.appendChild(div);
}

function initLabelSelect() {
    var div = document.createElement("div");

    var label = document.createElement("label");
    label.innerText = 'Src label: ';
    label.setAttribute("for", "srcLabel");

    var main = document.createElement("select");
    for (var i = 0; i < (labelName.length - 1); i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = labelName[i];
        if (i == srcLabel) {
            option.selected = true
        }
        main.add(option);
    }
    main.id = "srcLabel";
    main.addEventListener("change", changeSrcLabel);
    div.appendChild(label);
    div.appendChild(main);

    var divInputCfg = document.getElementById("divInputCfg");
    divInputCfg.appendChild(div);
}

function initFirstOutputMapping() {
    mappingElement = document.createElement("div");

    /* Src */
    var span = document.createElement("span");
    span.setAttribute("style", "max-width:30%;display:inline-block;");
    span.title = "This is the source button/axis on the Bluetooth controller";
    var label = document.createElement("label");
    label.innerText = 'Src';
    label.setAttribute("style", "display:block;");

    var src = document.createElement("select");
    for (var i = 0; i < 32; i++) {
        if (btnList[i][srcLabel] === "") {
            var option  = document.createElement("option");
            option.value = i;
            option.text = "NA" + i;
            src.add(option);
        }
        else {
            var option  = document.createElement("option");
            option.value = i;
            option.text = btnList[i][srcLabel];
            src.add(option);
        }
    }
    src.setAttribute("class", "src");
    span.appendChild(label);
    span.appendChild(src);
    mappingElement.appendChild(span);

    /* Dest */
    span = document.createElement("span");
    span.setAttribute("style", "max-width:30%;display:inline-block;");
    span.title = "This is the destination button/axis on the wired interface.";
    label = document.createElement("label");
    label.innerText = 'Dest';
    label.setAttribute("style", "display:block;");

    var dest = document.createElement("select");
    for (var i = 0; i < btnList.length; i++) {
        if (btnList[i][destLabel] === "" && i < 32) {
            var option  = document.createElement("option");
            option.value = i;
            option.text = "NA" + i;
            dest.add(option);
        }
        else if (btnList[i][destLabel] !== "" ) {
            var option  = document.createElement("option");
            option.value = i;
            option.text = btnList[i][destLabel];
            dest.add(option);
        }
    }
    dest.setAttribute("class", "dest");
    span.appendChild(label);
    span.appendChild(dest);
    mappingElement.appendChild(span);

    /* Max */
    span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "If source & destination is an axis then this is the scaling factor base on the destination maximum. If source is a button & destination is an axis then this is the value base on destination maximum that the axis will be set.";
    label = document.createElement("label");
    label.innerText = 'Max';
    label.setAttribute("style", "display:block;");

    var max = document.createElement("select");
    for (var i = 0; i <= maxMax; i += 5) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = i + "%";
        max.add(option);
    }
    max.setAttribute("class", "max");
    max.value = 100;
    span.appendChild(label);
    span.appendChild(max);
    mappingElement.appendChild(span);

    /* Threshold */
    span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "If source is an axis and destination is a button, this is the threshold requires on the source axis before the button is pressed.";
    label = document.createElement("label");
    label.innerText = 'Thres';
    label.setAttribute("style", "display:block;");

    var thres = document.createElement("select");
    for (var i = 0; i <= maxThres; i += 5) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = i + "%";
        thres.add(option);
    }
    thres.setAttribute("class", "thres");
    thres.value = 50;
    span.appendChild(label);
    span.appendChild(thres);
    mappingElement.appendChild(span);

    /* Deadone */
    span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "This is the axis dead zone around reset value.";
    label = document.createElement("label");
    label.innerText = 'Deadzone';
    label.setAttribute("style", "display:block;");

    var dz = document.createElement("select");
    for (var i = 0; i <= maxMax; i += 5) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = i/10000 + "%";
        dz.add(option);
    }
    dz.setAttribute("class", "dz");
    dz.value = 135;
    span.appendChild(label);
    span.appendChild(dz);
    mappingElement.appendChild(span);

    /* Turbo */
    span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "Turbo function base on the system frame rate.";
    label = document.createElement("label");
    label.innerText = 'Turbo';
    label.setAttribute("style", "display:block;");

    var turbo = document.createElement("select");
    for (var key in turboMask) {
        var option  = document.createElement("option");
        option.value = turboMask[key];
        option.text = key;
        turbo.add(option);
    }
    turbo.setAttribute("class", "turbo");
    span.appendChild(label);
    span.appendChild(turbo);
    mappingElement.appendChild(span);

    /* Add button */
    var addButton = document.createElement("button");
    addButton.innerText = '+';
    addButton.addEventListener("click", addInput);

    /* Save */
    var divSave = document.createElement("div");

    var btn = document.createElement("button");
    btn.id = "inputSave";
    btn.innerText = 'Save';
    btn.addEventListener("click", saveInput);
    divSave.appendChild(btn);
    divSave.setAttribute("style", "margin-top:1em;");

    var div = document.createElement("div");
    div.id = "inputSaveText";
    div.setAttribute("style", "display:none;margin-top:1em;");
    var p = document.createElement("p");
    p.setAttribute("style", "font-style:italic;font-size:small;color:green;");
    p.innerText = "Config saved, mapping changes take effect immediately.";

    div.appendChild(p);
    divSave.appendChild(div);

    /* Append first cfg */
    var divMappingGrp = document.createElement("div");
    var divMapping = document.createElement("div");
    divMapping.appendChild(mappingElement);
    divMapping.id = "divMapping";
    var divInputCfg = document.getElementById("divInputCfg");
    divMappingGrp.appendChild(divMapping);
    divMappingGrp.appendChild(addButton);
    divMappingGrp.appendChild(divSave);
    divInputCfg.appendChild(divMappingGrp);
}

function initOutputMapping() {
    mappingElement = document.createElement("div");

    /* Src */
    var src = document.createElement("select");
    src.setAttribute("style", "max-width:30%;");
    src.title = "This is the source button/axis on the Bluetooth controller";
    for (var i = 0; i < 32; i++) {
        if (btnList[i][srcLabel] === "") {
            var option  = document.createElement("option");
            option.value = i;
            option.text = "NA" + i;
            src.add(option);
        }
        else {
            var option  = document.createElement("option");
            option.value = i;
            option.text = btnList[i][srcLabel];
            src.add(option);
        }
    }
    src.setAttribute("class", "src");
    mappingElement.appendChild(src);

    /* Dest */
    var dest = document.createElement("select");
    dest.setAttribute("style", "max-width:30%;");
    dest.title = "This is the destination button/axis on the wired interface.";
    for (var i = 0; i < btnList.length; i++) {
        if (btnList[i][destLabel] === "" && i < 32) {
            var option  = document.createElement("option");
            option.value = i;
            option.text = "NA" + i;
            dest.add(option);
        }
        else if (btnList[i][destLabel] !== "" ) {
            var option  = document.createElement("option");
            option.value = i;
            option.text = btnList[i][destLabel];
            dest.add(option);
        }
    }
    dest.setAttribute("class", "dest");
    mappingElement.appendChild(dest);

    /* Max */
    var max = document.createElement("select");
    max.setAttribute("style", "max-width:10%;");
    max.title = "If source & destination is an axis then this is the scaling factor base on the destination maximum. If source is a button & destination is an axis then this is the value base on destination maximum that the axis will be set.";
    for (var i = 0; i <= maxMax; i += 5) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = i + "%";
        max.add(option);
    }
    max.setAttribute("class", "max");
    max.value = 100;
    mappingElement.appendChild(max);

    /* Threshold */
    var thres = document.createElement("select");
    thres.setAttribute("style", "max-width:10%;");
    thres.title = "If source is an axis and destination is a button, this is the threshold requires on the source axis before the button is pressed.";
    for (var i = 0; i <= maxThres; i += 5) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = i + "%";
        thres.add(option);
    }
    thres.setAttribute("class", "thres");
    thres.value = 50;
    mappingElement.appendChild(thres);

    /* Deadone */
    var dz = document.createElement("select");
    dz.setAttribute("style", "max-width:10%;");
    dz.title = "This is the axis dead zone around reset value.";
    for (var i = 0; i <= maxMax; i += 5) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = i/10000 + "%";
        dz.add(option);
    }
    dz.setAttribute("class", "dz");
    dz.value = 135;
    mappingElement.appendChild(dz);

    /* Turbo */
    var turbo = document.createElement("select");
    turbo.setAttribute("style", "max-width:10%;");
    turbo.title = "Turbo function base on the system frame rate.";
    for (var key in turboMask) {
        var option  = document.createElement("option");
        option.value = turboMask[key];
        option.text = key;
        turbo.add(option);
    }
    turbo.setAttribute("class", "turbo");
    mappingElement.appendChild(turbo);
}

function initBlueRetroCfg() {
    initInputSelect();
    initLabelSelect();
    initFirstOutputMapping();
    initOutputMapping();
    nbMapping = 1;
}

function writeReadRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc) {
    return new Promise(function(resolve, reject) {
        log('Set Input Ctrl CHRC... ' + inputCtrl[1]);
        ctrl_chrc.writeValue(inputCtrl)
        .then(_ => {
            log('Reading Input Data CHRC...');
            return data_chrc.readValue();
        })
        .then(value => {
            log('Got Input Data ' + value.byteLength);
            var tmp = new Uint8Array(value.buffer);
            cfg.set(tmp, inputCtrl[1]);
            log('Got Input Data ' + cfg[2] + ' ' + value.getUint8(2));
            if (value.byteLength == 512) {
                inputCtrl[1] += Number(512);
                resolve(writeReadRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc));
            }
            else {
                resolve(cfg);
            }
        })
        .catch(error => {
            reject(error);
        });
    });
}

function readInputCfg(cfgId, cfg) {
    return new Promise(function(resolve, reject) {
        let ctrl_chrc = null;
        let data_chrc = null;
        brService.getCharacteristic(brUuid[1])
        .then(chrc => {
            ctrl_chrc = chrc;
            return brService.getCharacteristic(brUuid[2])
        })
        .then(chrc => {
            var inputCtrl = new Uint16Array(2);
            inputCtrl[0] = Number(cfgId);
            inputCtrl[1] = 0;
            data_chrc = chrc;
            return writeReadRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc);
        })
        .then(value => {
            log('Input ' + cfgId + ' Config size: ' + cfg.byteLength);
            resolve(cfg);
        })
        .catch(error => {
            reject(error);
        });
    });
}

function loadInputCfg(cfgId) {
    return new Promise(function(resolve, reject) {
        var cfg = new Uint8Array(2051);
        log('Get Input ' + cfgId + ' Config CHRC...');
        readInputCfg(cfgId, cfg)
        .then(value => {
            log('Input ' + cfgId + ' Config size: ' + value.byteLength);
            //document.getElementById("mainInput").value = value[0];
            //document.getElementById("subInput").value = value[1];

            var div = document.getElementById("divMapping");
            if (value[2] < nbMapping) {
                var range = nbMapping - value[2];
                for (var i = 0; i < range; i++) {
                    div.removeChild(div.lastChild);
                }
            }
            else if (value[2] > nbMapping) {
                var range = value[2] - nbMapping;
                for (var i = 0; i < range; i++) {
                    addInput();
                }
            }
            nbMapping = value[2];
            var src = document.getElementsByClassName("src");
            var dest = document.getElementsByClassName("dest");
            var max = document.getElementsByClassName("max");
            var thres = document.getElementsByClassName("thres");
            var dz = document.getElementsByClassName("dz");
            var turbo = document.getElementsByClassName("turbo");

            log('Loading Mapping Found: ' + src.length + ' nbMapping: ' + nbMapping + ' cfg: ' + value[2]);

            var j = 3;
            for (var i = 0; i < nbMapping; i++) {
                src[i].value = value[j++];
                dest[i].value = value[j++];
                j++;
                max[i].value = value[j++];
                thres[i].value = value[j++];
                dz[i].value = value[j++];
                turbo[i].value = value[j++];
                j++;
            }
            resolve();
        })
        .catch(error => {
            reject(error);
        });
    });
}

function writeWriteRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc) {
    return new Promise(function(resolve, reject) {
        log('Set Input Ctrl CHRC... ' + inputCtrl[1]);
        ctrl_chrc.writeValue(inputCtrl)
        .then(_ => {
            log('Writing Input Data CHRC...');
            var tmpViewSize = cfg.byteLength - inputCtrl[1];
            if (tmpViewSize > 512) {
                tmpViewSize = 512;
            }
            var tmpView = new DataView(cfg.buffer, inputCtrl[1], tmpViewSize);
            return data_chrc.writeValue(tmpView);
        })
        .then(_ => {
            log('Input Data Written');
            inputCtrl[1] += Number(512);
            if (inputCtrl[1] < cfg.byteLength) {
                resolve(writeWriteRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc));
            }
            else {
                resolve();
            }
        })
        .catch(error => {
            reject(error);
        });
    });
}

function writeInputCfg(cfgId, cfg) {
    return new Promise(function(resolve, reject) {
        let ctrl_chrc = null;
        let data_chrc = null;
        brService.getCharacteristic(brUuid[1])
        .then(chrc => {
            ctrl_chrc = chrc;
            return brService.getCharacteristic(brUuid[2])
        })
        .then(chrc => {
            var inputCtrl = new Uint16Array(2);
            inputCtrl[0] = Number(cfgId);
            inputCtrl[1] = 0;
            data_chrc = chrc;
            return writeWriteRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc);
        })
        .then(_ => {
            resolve(cfg);
        })
        .catch(error => {
            reject(error);
        });
    });
}

function saveInput() {
    document.getElementById("inputSaveText").style.display = 'none';
    var cfgSize = nbMapping*8 + 3;
    var cfg = new Uint8Array(cfgSize);
    var cfgId = document.getElementById("inputSelect").value;

    var src = document.getElementsByClassName("src");
    var dest = document.getElementsByClassName("dest");
    var max = document.getElementsByClassName("max");
    var thres = document.getElementsByClassName("thres");
    var dz = document.getElementsByClassName("dz");
    var turbo = document.getElementsByClassName("turbo");

    var j = 0;
    cfg[j++] = 0;//document.getElementById("mainInput").value;
    cfg[j++] = 0;//document.getElementById("subInput").value;
    cfg[j++] = nbMapping;

    for (var i = 0; i < nbMapping; i++) {
        cfg[j++] = src[i].value;
        cfg[j++] = dest[i].value;
        cfg[j++] = 0
        cfg[j++] = max[i].value;
        cfg[j++] = thres[i].value;
        cfg[j++] = dz[i].value;
        cfg[j++] = turbo[i].value;
        cfg[j++] = 0
    }

    return new Promise(function(resolve, reject) {
        writeInputCfg(cfgId, cfg)
        .then(_ => {
            document.getElementById("inputSaveText").style.display = 'block';
            log('Input ' + cfgId + ' Config saved');
            resolve();
        })
        .catch(error => {
            reject(error);
        });
    });
}

function onDisconnected() {
    log('> Bluetooth Device disconnected');
    document.getElementById("divBtConn").style.display = 'block';
    document.getElementById("divInfo").style.display = 'none';
    document.getElementById("divCfgSel").style.display = 'none';
    //document.getElementById("divBtDisconn").style.display = 'none';
    document.getElementById("divGlobalCfg").style.display = 'none';
    document.getElementById("divOutputCfg").style.display = 'none';
    document.getElementById("divInputCfg").style.display = 'none';
}

export function btConn() {
    log('Requesting Bluetooth Device...');
    navigator.bluetooth.requestDevice(
        {filters: [{namePrefix: 'BRX'}],
        optionalServices: [brUuid[0]]})
    .then(device => {
        log('Connecting to GATT Server...');
        name = device.name;
        bluetoothDevice = device;
        bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
        return bluetoothDevice.gatt.connect();
    })
    .then(server => {
        log('Getting BRX Service...');
        return server.getPrimaryService(brUuid[0]);
    })
    .then(service => {
        brService = service;
        log('API');
        return getApiVersion(brService);
    })
    .then(value => {
        apiVersion = value;
        log('BDADDR');
        return getBdAddr(brService);
    })
    .then(value => {
        bdaddr = value;
        log('Version');
        return getAppVersion(brService);
    })
    .then(value => {
        app_ver = value;
        log("ABI version: " + apiVersion);
        log('Init Cfg DOM...');
        initBlueRetroCfg();
        return loadInputCfg(0);
    })
    .then(() => {
        document.getElementById("divInfo").innerHTML = 'Connected to: ' + name + ' (' + bdaddr + ') [' + app_ver + ']';
        document.getElementById("divBtConn").style.display = 'none';
        //document.getElementById("divBtDisconn").style.display = 'block';
        document.getElementById("divInfo").style.display = 'block';
        document.getElementById("divCfgSel").style.display = 'block';
        document.getElementById("divGlobalCfg").style.display = 'block';
        document.getElementById("divOutputCfg").style.display = 'block';
        document.getElementById("divInputCfg").style.display = 'block';
    })
    .catch(error => {
        log('Couldn\'t connect to BRX, try again it may take a few tries!');
        log(error);
    });
}

function addInput() {
    if (nbMapping < maxMapping){
        nbMapping++;
        var div = document.getElementById("divMapping");
        var newSubDiv = mappingElement.cloneNode(true);
        var newButton = document.createElement("button");
        newButton.innerText = '-';
        newButton.addEventListener("click", delInput);
        newSubDiv.appendChild(newButton);
        newSubDiv.querySelector('.max').value = 100;
        newSubDiv.querySelector('.thres').value = 50;
        newSubDiv.querySelector('.dz').value = 135;
        div.appendChild(newSubDiv);
    }
}

function delInput() {
    this.parentNode.remove();
    nbMapping--;
}

function selectInput() {
    loadInputCfg(this.value);
}

function changeSrcLabel() {
    var select = document.getElementsByClassName("src");
    var str = ""
    var tmp;

    srcLabel = this.value;

    for (var i = 0; i < 32; i++) {
        if (btnList[i][srcLabel] === "") {
            str += "<option value=\"" + i + "\">" + "NA" + i + "</option>";
        }
        else {
            str += "<option value=\"" + i + "\">" + btnList[i][srcLabel] + "</option>";
        }
    }
    for (var i = 0; i < select.length; i++) {
        tmp = select[i].value;
        select[i].innerHTML = str;
        select[i].value = tmp;
    }
    mappingElement.querySelector('.src').innerHTML = str;
}
