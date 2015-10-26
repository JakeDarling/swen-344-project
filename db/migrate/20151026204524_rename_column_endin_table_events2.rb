class RenameColumnEndinTableEvents2 < ActiveRecord::Migration
  def up
  	rename_column :events, :end, :end1
  end
end
