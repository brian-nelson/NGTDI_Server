﻿using System;
using System.Linq;
using System.Text;
using Nancy;
using NGTDI.Library.Managers;
using NGTDI.Library.Objects;
using TreeGecko.Library.Net.Objects;

namespace Site.Helpers
{
    public static class AuthHelper
    {
        public static bool IsAuthorized(Request _request, out User _user)
        {
            NGTDIManager manager = new NGTDIManager();

            string username = _request.Headers["Username"].First();
            string authToken = _request.Headers["AuthorizationToken"].First();

            User user = manager.GetUser(username);
            if (user != null)
            {
                TGUserAuthorization userAuth = manager.GetUserAuthorization(user.Guid, authToken);

                if (userAuth != null
                    && !userAuth.IsExpired())
                {
                    _user = user;

                    return true;
                }
            }

            _user = null;
            return false;
        }

        public static string Authorize(string _username, string _password, out User _user)
        {
            NGTDIManager manager = new NGTDIManager();
            _user = manager.GetUser(_username);

            if (_user != null)
            {
                if (_user.IsVerified)
                {
                    if (_user.Active)
                    {
                        if (manager.ValidateUser(_user, _password))
                        {
                            TGUserAuthorization authorization =
                                TGUserAuthorization.GetNew(_user.Guid, "unknown");
                            manager.Persist(authorization);

                            //Done with a string builder to avoid the json braces that confuse string.format
                            StringBuilder sb = new StringBuilder();
                            sb.Append("{ \"Result\":\"Success\", \"AuthorizationToken\":\"");
                            sb.Append(authorization.AuthorizationToken);
                            sb.Append("\", \"DisplayName\":\"");
                            sb.Append(_user.DisplayName);
                            sb.Append("\", \"UserName\":\"");
                            sb.Append(_user.Username);
                            sb.Append("\" }");

                            return sb.ToString();
                        }

                        //Bad password or username
                        manager.LogWarning(Guid.Empty, "User not found");
                        _user = null;
                        return @"{ ""Result"":""BadUserOrPassword"" }";
                    }

                    //user not active
                    //Todo - Log Something
                    manager.LogWarning(_user.Guid, "User Not Active");
                    _user = null;
                    return @"{ ""Result"":""NotActive"" }";
                }

                //User not verified
                //Todo - Log Something
                manager.LogWarning(_user.Guid, "User not verified");
                _user = null;
                return @"{ ""Result"":""NotVerified"" }";
            }

            //User not found
            manager.LogWarning(Guid.Empty, "User not found");
            _user = null;
            return @"{ ""Result"":""BadUserOrPassword"" }";
        }

        public static string Authorize(Request _request, out User _user)
        {
            string username = _request.Headers["Username"].First();
            string password = _request.Headers["Password"].First();

            return Authorize(username, password, out _user);
        }
    }
}