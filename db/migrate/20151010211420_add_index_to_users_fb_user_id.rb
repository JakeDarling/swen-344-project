class AddIndexToUsersFbUserId < ActiveRecord::Migration
  def change
  	add_index :users, :fbUserId, unique: true
  end
end
