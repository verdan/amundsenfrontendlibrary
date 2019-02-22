
import * as React from 'react';
import ReactDOM from 'react-dom';
import serialize from 'form-serialize';

import AvatarLabel, { AvatarLabelProps } from '../common/AvatarLabel';
import { Modal } from 'react-bootstrap';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

export interface DispatchFromProps {
  onAddItem: (value: string, onSuccess?: () => any, onFailure?: () => any) => void;
  onDeleteItem: (value: string, onSuccess?: () => any, onFailure?: () => any) => void;
}

export interface ComponentProps {
  readOnly: boolean;
}

export interface StateFromProps {
  isLoading: boolean;
  itemProps: Map<string, AvatarLabelProps>;
}

type AvatarLabelListProps = ComponentProps & DispatchFromProps & StateFromProps;

interface AvatarLabelListState {
  itemProps: Map<string, AvatarLabelProps>;
  isLoading: boolean;
  readOnly: boolean;
  showModal: boolean;
  tempItemProps: Map<string, AvatarLabelProps>;
}

class AvatarLabelList extends React.Component<AvatarLabelListProps, AvatarLabelListState> {
  private inputRef: React.RefObject<HTMLInputElement>;

  public static defaultProps: AvatarLabelListProps = {
    readOnly: true,
    isLoading: false,
    itemProps: new Map(),
    onAddItem: null,
    onDeleteItem: null,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { isLoading, itemProps, readOnly } = nextProps;
    return { isLoading, itemProps, readOnly, tempItemProps: itemProps };
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      itemProps: props.itemProps,
      readOnly: props.readOnly,
      showModal: false,
      tempItemProps: props.itemProps,
    };

    this.inputRef = React.createRef();
  }

  handleShow = () => {
    this.setState({ showModal: true });
  }

  cancelEdit = () => {
    // TODO: Remove tempItemProps update
    this.setState({ tempItemProps: this.state.itemProps, showModal: false });
  }

  saveEdit = () => {
    // TODO BLOCKER: Filter and call addItem/deleteItem and remove itemProps update
    /*const itemKeys = Object.keys(this.state.itemProps);
    const tempItemKeys = Object.keys(this.state.tempItemProps);

    itemKeys.forEach((key) => {
      if (!this.state.tempItemProps[key]) {
        this.deleteItem(this.state.itemProps[key]);
      }
    })
    tempItemKeys.forEach((key) => {
      if (!this.state.itemProps[key]) {
        this.addItem(this.state.tempItemProps[key]);
      }
    })*/
    this.setState({ itemProps: this.state.tempItemProps, showModal: false });

  }

  addItem = (item: AvatarLabelProps) => {
  /*  const value = item.label;
    const onSuccessCallback = () => {
      const updatedItemProps = {
        ...this.state.itemProps,
        [value]: { label: value },
      };
      this.setState({ itemProps: updatedItemProps });
    }

    this.props.onAddItem(value, onSuccessCallback, null);*/
  }

  deleteItem = (item: AvatarLabelProps) => {
    /*const value = item.label;
    const onSuccessCallback = () => {
      const updatedItemProps = Object.keys(this.state.itemProps).reduce((newItemProps, key) => {
          if (key !== value) {
            newItemProps[key] = this.state.itemProps[key];
          }
          return newItemProps;
      }, {});
      this.setState({ itemProps: updatedItemProps });
    }

    this.props.onDeleteItem(item.label, onSuccessCallback, null);*/
  }

  recordAddItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inputElement = this.inputRef.current;
    const value = inputElement.value;
    const newTempItemProps = new Map(this.state.tempItemProps);
    newTempItemProps.set(value, { label: value });
    this.setState({ tempItemProps: newTempItemProps });
    console.log(newTempItemProps);
  }

  recordDeleteItem = (key: string) => {
    const newTempItemProps = new Map(this.state.tempItemProps);
    newTempItemProps.delete(key)
    this.setState({ tempItemProps: newTempItemProps });
    console.log(newTempItemProps);
  }

  render() {
    let content;
    const items = [];
    const modalItems = [];

    if (this.state.itemProps.size === 0) {
      content = <label className="empty-message">No entries exist</label>;
    }
    else {
      this.state.itemProps.forEach((value, key) => {
        const item = (
          <li key={`list-item:${key}`}>
            { React.createElement(AvatarLabel, value) }
          </li>
        );
        items.push(item);
      });

      if (this.state.showModal) {
        this.state.tempItemProps.forEach((value, key) => {
          const modalItem = (
            <li key={`modal-list-item:${key}`}>
              { React.createElement(AvatarLabel, value) }
              <button
                className='btn icon delete-button'
                aria-label='Delete Item'
                /* tslint:disable - TODO: Investigate jsx-no-lambda rule */
                onClick={() => this.recordDeleteItem(key)}
                /* tslint:enable */
              />
            </li>
          );
          modalItems.push(modalItem);
        });
      }

      content = (
        <ul className='component-list'>
          { items }
        </ul>
      );
    }

    return (
      <div className='editable-list-component'>
        { content }
        <button
         className='btn add-list-item'
         disabled={this.state.readOnly}
         onClick={this.handleShow}>
           <img className='icon icon-plus-circle'/>
           <span>Add</span>
        </button>


        <Modal className='editable-list-modal' show={this.state.showModal} onHide={this.cancelEdit}>
          <Modal.Header className="text-center" closeButton={false}>
            <Modal.Title>Owned By</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className='component-form' onSubmit={this.recordAddItem}>
              <input
                id='add-item-input'
                autoFocus={true}
                placeholder='Enter an email address'
                ref={ this.inputRef }
              />
              <button className="btn btn-light add-btn" type="submit" aria-label="Add Item">
                <span aria-hidden="true">Add</span>
              </button>
            </form>
            <ul className='component-list'>
              { modalItems }
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn cancel-btn" onClick={this.cancelEdit}>Cancel</button>
            <button type="button" className="btn save-btn" onClick={this.saveEdit}>Save</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default AvatarLabelList;
