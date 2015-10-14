require 'test_helper'

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  def setup
    @user = User.new(fbUserId:"Test")
    @dup = User.new(fbUserId:"Test")
  end

  test "should be valid" do
    assert @user.valid?
  end

  test "fbUserId should be present" do
    @user.fbUserId = "     "
    assert_not @user.valid?
  end
  
  test "fbUserId should be unique" do
  	@user.save
  	assert_not @dup.valid?
  	@dup.fbUserId = "Test2"
  	assert @dup.valid?
  end
end
