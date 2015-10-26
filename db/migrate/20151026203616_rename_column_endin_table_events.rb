class RenameColumnEndinTableEvents < ActiveRecord::Migration
  def change
  	rename_column :events, :end, :end1
  end
end
