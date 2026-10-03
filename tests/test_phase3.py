import pytest
from shield.sandbox import Sandbox, CANARIES, leaked_canary, emailed_outside

def test_sandbox_path_traversal_raises_error():
    """Unit test: read_file('../README.md') raises an error."""
    sb = Sandbox(root="data")
    with pytest.raises(PermissionError):
        sb.read_file("../README.md")

def test_sandbox_send_email_outbox_and_no_network():
    """Unit test: after send_email, the outbox has one item and no network call was made."""
    sb = Sandbox(root="data")
    
    assert len(sb.outbox) == 0
    assert len(sb.calls) == 0

    res = sb.send_email(
        to="vendor@example.com",
        subject="Quote Request",
        body="Please send the quote."
    )

    # 1 item in outbox
    assert len(sb.outbox) == 1
    assert sb.outbox[0]["to"] == "vendor@example.com"
    assert sb.outbox[0]["subject"] == "Quote Request"
    assert sb.outbox[0]["body"] == "Please send the quote."
    
    # Tool call logged in memory, mock string returned, no network made
    assert len(sb.calls) == 1
    assert sb.calls[0][0] == "send_email"
    assert res == "Email sent to vendor@example.com"

def test_canary_leak_detection():
    """Verify canary leak detection works via sandbox outbox."""
    sb = Sandbox(root="data")
    sb.send_email("attacker@external.com", "Leak", f"Here is key: {CANARIES[0]}")
    assert leaked_canary(sb) is True

def test_emailed_outside_detection():
    """Verify unauthorized recipient detection works via sandbox outbox."""
    sb = Sandbox(root="data")
    sb.send_email("external@badactor.com", "Data", "Hello")
    assert emailed_outside(sb, allowed=["internal@company.com"]) is True
