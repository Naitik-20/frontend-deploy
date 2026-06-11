import { useEffect, useMemo, useState } from 'react';
import { AtSign, Loader, MapPin, Phone, Search, UserRound, Users } from 'lucide-react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { getNormalUsers } from '../services/userService';

const formatAddress = (address) => {
  if (!address) return '-';

  return [
    address.address,
    address.city,
    address.region,
    address.zip,
    address.country,
  ].filter(Boolean).join(', ') || '-';
};

const getPrimaryAddress = (user) => (
  user.addresses?.find((address) => address.isDefault) || user.addresses?.[0] || null
);

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
};

export default function NormalUsersManagement() {
  const { setActiveTab, actionStatus, setActionStatus } = useAdminDashboard();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setActiveTab('users');
  }, [setActiveTab]);

  useEffect(() => {
    let ignore = false;

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const data = await getNormalUsers();
        if (!ignore) setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!ignore) {
          setActionStatus?.({ type: 'error', message: error.message });
          setTimeout(() => setActionStatus?.(null), 2500);
        }
      } finally {
        if (!ignore) setLoadingUsers(false);
      }
    };

    fetchUsers();

    return () => {
      ignore = true;
    };
  }, [setActionStatus]);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return users;

    return users.filter((user) => {
      const address = getPrimaryAddress(user);
      return [
        user.name,
        user.email,
        address?.phone,
        formatAddress(address),
      ].some((value) => String(value || '').toLowerCase().includes(query));
    });
  }, [searchTerm, users]);

  const usersWithAddress = useMemo(
    () => users.filter((user) => Boolean(getPrimaryAddress(user))).length,
    [users]
  );

  return (
    <div className="tab-pane animate-fade normal-users-page">
      <div className="users-hero-panel">
        <div className="users-hero-copy">
          <span className="users-kicker">Customer directory</span>
          <h2>Normal User Details</h2>
          <p>Review customer contact details, phone numbers, and default delivery addresses.</p>
        </div>
        <div className="users-stat-row">
          <div className="users-stat-card">
            <Users size={18} />
            <div>
              <strong>{users.length}</strong>
              <span>Total users</span>
            </div>
          </div>
          <div className="users-stat-card">
            <MapPin size={18} />
            <div>
              <strong>{usersWithAddress}</strong>
              <span>With address</span>
            </div>
          </div>
        </div>
      </div>

      <div className="workspace-card users-table-card">
        <div className="users-toolbar">
          <div className="users-search-box">
            <Search size={18} />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, email, phone, city or address"
            />
          </div>
          <span className="users-result-pill">{filteredUsers.length} shown</span>
        </div>

        {actionStatus?.type === 'error' && (
          <div className="toast-inline error">{actionStatus.message}</div>
        )}

        {loadingUsers ? (
          <div className="tab-loader">
            <Loader className="spin" size={32} color="#0a58a4" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-table-state">
            <h4>No normal users found</h4>
            <p>Registered customer accounts will appear here automatically.</p>
          </div>
        ) : (
          <div className="products-table-wrapper users-table-wrapper">
            <table className="products-table users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Default Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const address = getPrimaryAddress(user);

                  return (
                    <tr key={user._id}>
                      <td>
                        <div className="user-identity-cell">
                          <div className="user-avatar">{getInitials(user.name)}</div>
                          <div>
                            <strong>{user.name || 'Unnamed User'}</strong>
                            <span>ID: {user._id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="user-contact-line">
                          <AtSign size={15} />
                          <span>{user.email || '-'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="user-contact-line">
                          <Phone size={15} />
                          <strong>{address?.phone || '-'}</strong>
                        </div>
                      </td>
                      <td>
                        {address ? (
                          <div className="user-address-cell">
                            <span className="address-label-pill">
                              <MapPin size={13} />
                              {address.label || 'Address'}
                            </span>
                            <strong>{formatAddress(address)}</strong>
                          </div>
                        ) : (
                          <span className="missing-address-pill">
                            <UserRound size={13} />
                            No address saved
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style>{normalUsersStyles}</style>
    </div>
  );
}

const normalUsersStyles = `
  .normal-users-page {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .users-hero-panel {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: stretch;
    background: #ffffff;
    border: 1px solid #e6e8ef;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
  }

  .users-hero-copy {
    min-width: 0;
  }

  .users-kicker {
    display: inline-flex;
    align-items: center;
    min-height: 24px;
    padding: 0 10px;
    border-radius: 999px;
    background: #eef6ff;
    color: #0a58a4;
    font-size: 12px;
    font-weight: 900;
  }

  .users-hero-copy h2 {
    margin: 10px 0 6px;
    color: #10243d;
    font-size: 24px;
    font-weight: 900;
  }

  .users-hero-copy p {
    color: #64748b;
    font-size: 14px;
    margin: 0;
  }

  .users-stat-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(132px, 1fr));
    gap: 12px;
    min-width: 290px;
  }

  .users-stat-card {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 74px;
    padding: 14px;
    border: 1px solid #e6e8ef;
    border-radius: 8px;
    background: #f8fafc;
    color: #0a58a4;
  }

  .users-stat-card strong {
    display: block;
    color: #10243d;
    font-size: 22px;
    line-height: 1;
  }

  .users-stat-card span {
    display: block;
    color: #64748b;
    font-size: 12px;
    font-weight: 800;
    margin-top: 5px;
  }

  .users-table-card {
    padding: 18px;
  }

  .users-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
  }

  .users-search-box {
    flex: 1;
    min-width: 240px;
    min-height: 44px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 14px;
    border: 1.5px solid #dfe7f1;
    border-radius: 8px;
    background: #ffffff;
    color: #64748b;
  }

  .users-search-box:focus-within {
    border-color: #0a58a4;
    box-shadow: 0 0 0 3px rgba(10, 88, 164, 0.1);
  }

  .users-search-box input {
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: #10243d;
    font-size: 14px;
  }

  .users-result-pill {
    min-height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
    border-radius: 999px;
    background: #fff7ed;
    color: #c45f08;
    font-size: 12px;
    font-weight: 900;
    white-space: nowrap;
  }

  .users-table-wrapper {
    border-radius: 8px;
    border: 1px solid #e6e8ef;
    overflow: auto;
  }

  .users-table {
    min-width: 880px;
  }

  .users-table th {
    background: #f8fafc;
    color: #475569;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0;
  }

  .users-table td {
    vertical-align: top;
  }

  .user-identity-cell {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 240px;
  }

  .user-avatar {
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    background: #0a58a4;
    color: #ffffff;
    font-size: 14px;
    font-weight: 900;
  }

  .user-identity-cell strong,
  .user-address-cell strong {
    display: block;
    color: #10243d;
    font-size: 14px;
    line-height: 1.45;
  }

  .user-identity-cell span {
    display: block;
    max-width: 230px;
    color: #7c8796;
    font-size: 12px;
    margin-top: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .user-contact-line {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    max-width: 260px;
    color: #334155;
    font-size: 13px;
    word-break: break-word;
  }

  .user-contact-line svg {
    flex: 0 0 auto;
    color: #0a58a4;
  }

  .user-address-cell {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 260px;
    max-width: 420px;
  }

  .address-label-pill,
  .missing-address-pill {
    width: fit-content;
    min-height: 24px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 900;
  }

  .address-label-pill {
    background: #ecfdf3;
    color: #08703f;
  }

  .missing-address-pill {
    background: #f1f5f9;
    color: #64748b;
  }

  @media (max-width: 900px) {
    .users-hero-panel,
    .users-toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    .users-stat-row {
      min-width: 0;
      grid-template-columns: 1fr;
    }
  }
`;
