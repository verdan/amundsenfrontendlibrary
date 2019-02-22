import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { GlobalState } from "../../../ducks/rootReducer";
import { updateTableOwner, UpdateMethod } from '../../../ducks/tableMetadata/reducer';

import AvatarLabelList, { ComponentProps, DispatchFromProps, StateFromProps } from '../../../components/AvatarLabelList';

function onAddItem(value, onSuccess, onFailure) {
  return updateTableOwner(value, UpdateMethod.PUT, onSuccess, onFailure);
}

function onDeleteItem(value, onSuccess, onFailure) {
  return updateTableOwner(value, UpdateMethod.DELETE, onSuccess, onFailure);
}

export const mapStateToProps = (state: GlobalState) => {
  const items = state.tableMetadata.tableData.owners.map((entry) => {
    // TODO: owner user object needs a proper id
    return [entry.display_name, { label: entry.display_name }] as [string, {}];
  });
  return {
    isLoading: false,
    itemProps: new Map<string, {}>(items),
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ onAddItem, onDeleteItem } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps, ComponentProps>(mapStateToProps, mapDispatchToProps)(AvatarLabelList);
