import * as React from "react";
import { IActor } from "@tandem/common/actors";
import { inject } from "@tandem/common/decorators";
import {
  Injector,
  IInjectable,
  PrivateBusProvider,
  InjectorProvider,
} from "@tandem/common/ioc";

export interface IApplicationComponentContext {
  bus: IActor;
  injector: Injector;
}

export const appComponentContextTypes = {
  bus: React.PropTypes.object,
  injector: React.PropTypes.object
};

export class BaseApplicationComponent<T, U> extends React.Component<T, U> implements IInjectable {

  static contextTypes = appComponentContextTypes;

  @inject(PrivateBusProvider.ID)
  protected readonly bus: IActor;

  @inject(InjectorProvider.ID)
  protected readonly injector: Injector

  constructor(props: T, context: IApplicationComponentContext, callbacks: any) {
    super(props, context, callbacks);

    if (context.injector) {
      context.injector.inject(this);
    } else {
      console.error(`Failed to inject properties into `, this.constructor.name);
    }
  }

  $didInject() {

  }
}

export class RootApplicationComponent extends React.Component<IApplicationComponentContext, {}> implements IInjectable {

  static childContextTypes = appComponentContextTypes;

  getChildContext() {
    return {
      bus: this.props.bus,
      injector: this.props.injector
    };
  }

  render() {
    return <span>{ this.props.children } </span>;
  }
}