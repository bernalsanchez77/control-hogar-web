import Requests from '../requests';
const isPc = window.location.hostname === 'localhost';
const requests = new Requests(isPc);

class SupabaseModify {
  modifyTable(table, tableName, el) {
    let newId = null;
    let currentId = null;
    const newDate = new Date().toISOString();
    if (table.find(v => v.state === 'selected')) {
      currentId = table.find(v => v.state === 'selected').id;
    }
    if (el) {
      if (table.find(v => v.id === el.value)) {
        newId = table.find(v => v.id === el.value).id;
      }
    }
    if (currentId && newId) {
      requests.updateTableInSupabase({
        current: {currentId: currentId, currentTable: tableName, currentState: ''},
        new: {newId: newId, newTable: tableName, newState: 'selected', newDate: newDate}
      });
    } else if (currentId) {
      requests.updateTableInSupabase({
        current: {currentId: currentId, currentTable: tableName, currentState: ''}
      });
    } else if (newId) {
      requests.updateTableInSupabase({
        new: {newId: newId, newTable: tableName, newState: 'selected', newDate: newDate}
      });
    }
  }

  updateTable(tableName, el, id, date) {
    requests.updateTableInSupabase({
      new: {newId: id, newTable: tableName, ['new' + el.key.charAt(0).toUpperCase() + el.key.slice(1)]: el.value, newDate: date || new Date().toISOString()}
    });
  }
}
const supabaseModifyInstance = new SupabaseModify();
export default supabaseModifyInstance;
