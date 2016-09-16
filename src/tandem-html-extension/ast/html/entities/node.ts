import * as sift from "sift";
import { ITyped } from "tandem-common/object";
import { inject } from "tandem-common/decorators";
import { HTMLFile } from "tandem-html-extension/models/html-file";
import { BubbleBus } from "tandem-common/busses";
import { DocumentFile } from "tandem-front-end/models";
import { MetadataKeys } from "tandem-front-end/constants";
import { IHTMLNodeEntity } from "./base";
import { HTMLNodeExpression } from "tandem-html-extension/ast";
import { PropertyChangeAction } from "tandem-common/actions";
import { IDOMSection, NodeSection, GroupNodeSection } from "tandem-html-extension/dom";
import { IEntity, EntityMetadata, IEntityDocument, BaseEntity, IExpression } from "tandem-common/ast";
import { IInjectable, DEPENDENCIES_NS, Dependencies, EntityFactoryDependency, Injector } from "tandem-common/dependencies";

export abstract class HTMLNodeEntity<T extends HTMLNodeExpression> extends BaseEntity<T> implements IHTMLNodeEntity {

  private _section: IDOMSection;
  private _nodeName: string;
  public document: HTMLFile;

  get section(): IDOMSection {
    return this._section;
  }

  get parentNode(): BaseEntity<T> {
    return this.parent;
  }

  get childNodes(): Array<HTMLNodeEntity<T>> {
    return <any>this.children.filter(<any>sift({ $type: HTMLNodeEntity }));
  }

  get nodeName(): string {
    return this._nodeName;
  }

  shouldDispose() {
    return super.shouldDispose() || this.nodeName !== this.source.name;
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.CHILD_LAYER_PROPERTY]: "childNodes"
    });
  }

  insertDOMChildBefore(newChild: Node, beforeChild: Node) {
    this.section.targetNode.insertBefore(newChild, beforeChild);
  }

  appendDOMChild(newChild: Node) {
    this.section.appendChild(newChild);
  }

  onChildRemoved(child: HTMLNodeEntity<T>) {
    super.onChildRemoved(child);
    if (child.section) child.section.remove();
  }

  onChildAdded(child: HTMLNodeEntity<T>) {
    super.onChildAdded(child);
    if (child.section) {
      const childNodes = this.childNodes;
      const nextHTMLEntitySibling: HTMLNodeEntity<T> = childNodes[childNodes.indexOf(child) + 1];

      if (nextHTMLEntitySibling) {
        const ppSection = nextHTMLEntitySibling.section;

        if (nextHTMLEntitySibling.section instanceof NodeSection) {
          this.insertDOMChildBefore(child.section.toFragment(), ppSection.targetNode);
        } else {
          this.insertDOMChildBefore(child.section.toFragment(), (<GroupNodeSection>ppSection).startNode);
        }
      } else {
        this.appendDOMChild(child.section.toFragment());
      }
    }
  }

  protected initialize() {
    super.initialize();
    this._section  = this.createSection();
    this._nodeName = this.source.name;
  }

  protected abstract createSection();
}