export async function requestMedia(constraints?: MediaStreamConstraints): Promise<MediaStream> {
  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch(e) {
    console.log(e);
    return null;
  }
}

export class MediaDeviceList extends HTMLElement {
  public constructor() {
    super();
  }

  public async getDevices(): Promise<MediaDeviceInfo[]> {
    return await navigator.mediaDevices.enumerateDevices();
  }

  private async appendDeviceInfo(): Promise<void> {
    this._unorderedList = document.createElement('ul');
    this.appendChild(this._unorderedList);

    const devices = await this.getDevices();
    devices.forEach(device => {
      const d = document.createElement('li');
      d.textContent = `${device.label} - ${device.kind}, ${device.deviceId}, ${device.groupId}`;
      this._unorderedList.appendChild(d);
    });
  }

  public connectedCallback() {
    if (!this.init) {
      void this.appendDeviceInfo();
      this.init = true;
    }
  }

  private _unorderedList: HTMLUListElement;
  private init = false;
}

customElements.define('media-device-list', MediaDeviceList);