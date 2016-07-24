import { IApplication } from 'sf-base/application';

import { Logger } from 'sf-core/logger';
import { loggable } from 'sf-core/decorators';
import { BaseApplicationService } from 'sf-core/services';
import { ApplicationServiceFragment } from 'sf-core/fragments';

function targetIsInput(event) {
  return /input|textarea/i.test(event.target.nodeName);
}

@loggable()
export default class ClipboardService extends BaseApplicationService<IApplication> {

  public logger:Logger;

  initialize() {
    document.addEventListener('copy', (event:any) => {
      if (targetIsInput(event)) return;
      this.logger.info('handle copy');

      // var selection = this.app.selection.map((entity) => (
      //   entity.expression
      // ));

      var selection = [];

      event.clipboardData.setData('text/x-entity', JSON.stringify(selection));
      event.preventDefault();
    });

    document.addEventListener('paste', (event:any) => {
      this.logger.info('handle paste');
      Array.prototype.forEach.call(event.clipboardData.items, this._paste);
    });
  }

  _paste = async (item) => {
    try {
      // await this.bus.execute({ type: 'paste', item: item });
    } catch (e) {
      this.logger.warn('cannot paste x-entity data: ', item.type);
    }
  }

  // something like this...


}

export const fragment = new ApplicationServiceFragment('clipboard', ClipboardService);