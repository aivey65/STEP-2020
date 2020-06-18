// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Query;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet stores and retrieves comment data. */
@WebServlet("/data")
public class DataServlet extends HttpServlet {
    private final DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

    /**
    * Class to organize comments for more detailed displays. By creating 
    * another class, adding new parameters and information to keep track 
    * of may be easier.
    */
    private static class Comment {
        private String name;
        private String comment;

        Comment(String newName, String newComment) {
            name = newName;
            comment = newComment;
        }

        public String toString() {
            return name + ": " + comment;
        }
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String name = request.getParameter("name");
        String comment = request.getParameter("comment");

        Entity commentEntity = new Entity("Comment");
        commentEntity.setProperty("name", name);
        commentEntity.setProperty("comment", comment);

        datastore.put(commentEntity);
        response.sendRedirect("/index.html");
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String input = request.getParameter("max-comments");
        int limit = 0;
        
        try {
            limit = Integer.parseInt(input);
        } catch (NumberFormatException e) {
            System.err.println("Could not convert to int: " + input);
            return;
        }

        Query query = new Query("Comment");
        Iterable<Entity> results = datastore.prepare(query).asIterable(FetchOptions.Builder.withLimit(limit));
        
        ArrayList<Comment> allComments = new ArrayList<Comment>();
        for (Entity entity : results) {
            String name = (String) entity.getProperty("name");
            String comment = (String) entity.getProperty("comment");

            allComments.add(new Comment(name, comment));
        }
        
        Gson gson = new Gson();
        String commentJsonString = gson.toJson(allComments);

        response.setContentType("application/json");
        response.getWriter().println(commentJsonString);
    }
}
